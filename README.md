# Cohere To OpenAI (Cloudflare Worker)

[简体中文](./docs/README-zh-CN.md)

This is a simple Cloudflare Worker that transform Cohere API to OpenAI API, easily deployable to Cloudflare Workers.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ckt1031/cohere2openai-cf-worker)

## Features

- [x] Transform Cohere API to OpenAI API
- [x] Model listing endpoint (GET /models)
- [x] Chat completion endpoint (POST /chat/completions)
- [x] Detect `-internet` in model to use Internet connector
- [ ] Tool Calling feature

## Special Internet Model

To enable the use of the Internet connector in any chatbot client, we support models with `-internet` in their name. While this is an unofficial feature, it helps reduce additional costs associated with using the Internet connector.

To utilize the Internet connector, simply append `-internet` to the model name. For example, `command-r-plus` would become `command-r-plus-internet`.

## How to Deploy

1. Clone this repository: `git clone https://github.com/ckt1031/cohere2openai-cf-worker.git --depth=1`
2. Run `npm install` to install dependencies
3. Run `npm run deploy` to deploy to Cloudflare Workers

## License

This project is licensed under the [MIT License](LICENSE).
