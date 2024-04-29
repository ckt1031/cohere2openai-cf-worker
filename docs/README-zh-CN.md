# Cohere To OpenAI (Cloudflare Worker)

[English](../README.md)

这是一个简单的 Cloudflare Worker，可以将 Cohere API 转换为 OpenAI API，并且可以轻松部署到 Cloudflare Workers。

[![部署到 Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ckt1031/cohere2openai-cf-worker)

## 特殊的 Internet 模型

为了在任何聊天机器人客户端中启用 Internet 连接器的使用，我们支持在模型名称中包含 `-internet` 的模型。虽然这是一个非官方功能，但它有助于减少使用 Internet 连接器相关的额外成本。

要使用 Internet 连接器，只需在模型名称后面添加 `-internet` 即可。例如，`command-r-plus` 将变成 `command-r-plus-internet`。

## 如何部署

1. 克隆此仓库：`git clone https://github.com/ckt1031/cohere2openai-cf-worker.git --depth=1`
2. 运行 `npm install` 安装依赖项
3. 运行 `npm run deploy` 部署到 Cloudflare Workers

## 许可证

本项目采用 [MIT 许可证](../LICENSE)。
