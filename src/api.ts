import { Context, Env } from "hono";
import { BlankInput } from "hono/types";
import OpenAI from "openai";
import { CohereClient, Cohere } from "cohere-ai";
import { streamSSE } from "hono/streaming";

type CohereRequestBody = Cohere.ChatRequest & {
  stream: boolean;
};

function getMessageContent(message: OpenAI.ChatCompletionMessageParam) {
  if (!message.content) throw new Error("Message content is required.");
  
  if (typeof message.content === "string") {
    return message.content;
  } else {
    let messageContent = "";
    
    // Only grab the text from the message
    for (const content of message.content) {
      if (content.type === "text") {
        messageContent = content.text;
      }
    }

    if (messageContent.length === 0) {
      throw new Error("Message content is required.");
    }

    return messageContent;
  }
}

function getAPIKey(c: Context<Env, "/v1/chat/completions", BlankInput>) {
  // Bearer token
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    throw new Error("Authorization header is required.");
  }

  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2) {
    throw new Error("Invalid Authorization header.");
  }

  if (tokenParts[0] !== "Bearer") {
    throw new Error("Invalid Authorization header.");
  }

  return tokenParts[1];
}

export async function handleChatCompletions(
  c: Context<Env, "/v1/chat/completions", BlankInput>
) {
  const apiKey = getAPIKey(c);

  const body = await c.req.json<OpenAI.ChatCompletionCreateParams>();

  // There will be *-internet, so check for that, and remove it
  const useInternet = body.model.includes("-internet");
  const model = body.model.replace("-internet", "");

  const apiRequestBody: CohereRequestBody = {
    message: "",
    model,
    chatHistory: [],
    frequencyPenalty: body.frequency_penalty ?? 0.0,
    presencePenalty: body.presence_penalty ?? 0.0,
    stream: body.stream ?? false,
    ...(body.max_tokens && { maxTokens: body.max_tokens }),
    ...(body.temperature && { temperature: body.temperature }),
    connectors: useInternet ? [{ id: "web-search" }] : [],
  };

  for (const message of body.messages) {
    type ChatMessageRoleType =
      (typeof Cohere.ChatMessageRole)[keyof typeof Cohere.ChatMessageRole];

    let role: ChatMessageRoleType = "SYSTEM";
    let messageContent: string = "";
    let addToHistory = true;

    const isLastMessage = body.messages[body.messages.length - 1] === message;

    if (message.role === "system") {
      role = Cohere.ChatMessageRole.System;
      messageContent = message.content;
    } else if (message.role === "user") {
      role = Cohere.ChatMessageRole.User;

      messageContent = getMessageContent(message);

      if (isLastMessage) {
        addToHistory = false;
        apiRequestBody.message = messageContent;
      }
    } else if (message.role === "assistant") {
      role = Cohere.ChatMessageRole.Chatbot;

      messageContent = getMessageContent(message);
    }

    if (addToHistory) {
      apiRequestBody.chatHistory?.push({
        role,
        message: messageContent,
      });
    }
  }

  const cohere = new CohereClient({
    token: apiKey,
  });

  if (body.stream) {
    const streamData = await cohere.chatStream(apiRequestBody);

    return streamSSE(c, async (stream) => {
      for await (const chat of streamData) {
        if (chat.eventType === "text-generation") {
          const sendChunk: OpenAI.ChatCompletionChunk = {
            id: "chatcmpl-123",
            object: "chat.completion.chunk",
            created: 1694268190,
            model: body.model,
            system_fingerprint: "fp_44709d6fcb",
            choices: [
              {
                index: 0,
                delta: { role: "assistant", content: chat.text },
                logprobs: null,
                finish_reason: null,
              },
            ],
          };
          await stream.writeSSE({
            data: JSON.stringify(sendChunk),
          });
        }
      }
    });
  } else {
    const chat = await cohere.chat(apiRequestBody);

    const returnCompletionBody: OpenAI.ChatCompletion = {
      id: "chatcmpl-123",
      object: "chat.completion",
      created: 1677652288,
      model: body.model,
      system_fingerprint: "fp_44709d6fcb",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: chat.text,
          },
          logprobs: null,
          finish_reason: "stop",
        },
      ],
    };

    return c.json(returnCompletionBody);
  }
}
