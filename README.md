# Cohere To OpenAI (Cloudflare Worker)

This is a simple Cloudflare Worker that transform Cohere API to OpenAI API, easily deployable to Cloudflare Workers.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ckt1031/cohere2openai-cf-worker)

## Features

- [x] Transform Cohere API to OpenAI API
- [x] Model listing endpoint (GET /models)
- [x] Chat completion endpoint (POST /chat/completions)
- [ ] Tool Calling feature

## How to Deploy

1. Clone this repository: `git clone https://github.com/ckt1031/cohere2openai-cf-worker.git --depth=1`
2. Run `npm install` to install dependencies
3. Run `npm run deploy` to deploy to Cloudflare Workers

## License

This project is licensed under the [MIT License](LICENSE).
