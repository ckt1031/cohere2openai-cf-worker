import { Hono } from "hono";
import OpenAI from "openai";
import { cors } from "hono/cors";
import { getErrorMessageJSON } from "./utils";
import { handleChatCompletions } from "./api";

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
  return c.json({
    message: "Welcome to Cohere to OpenAI Cloudflare Worker edition.",
  });
});

app.get("/v1/models", async (c) => {
  const models: OpenAI.PageResponse<OpenAI.Model> = {
    data: [],
    object: "list",
  };

  const availableModelStrings = [
    "command",
    "command-nightly",
    "command-light",
    "command-light-nightly",
    "command-r",
    "command-r-plus",
  ];

  for (const modelString of availableModelStrings) {
    models.data.push({
      id: modelString,
      created: 1686935002,
      object: "model",
      owned_by: "cohere",
    });
  }

  return c.json(models);
});

// Post /v1/chat/completions
app.post("/v1/chat/completions", handleChatCompletions);


app.notFound((c) => {
  return c.json(
    getErrorMessageJSON(
      `Unknown request URL: ${c.req.method} ${c.req.path}. Please check the URL for typos.`
    ),
    404
  );
});

export default app;
