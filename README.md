# @herai/wxclawbot-cli

```
                  _             _           _
 __      ___  __| | __ ___   _| |__   ___ | |_
 \ \ /\ / \ \/ /| |/ _` \ \ / / '_ \ / _ \| __|
  \ V  V /  >  <| | (_| |\ V /| |_) | (_) | |_
   \_/\_/ /_/\_\|_|\__,_| \_/ |_.__/ \___/ \__|
   WeixinClawBot CLI
```

[English](#english) | [简体中文](#简体中文)

---

## English

Send text, images, video, and files to WeChat users from scripts, cron jobs, or AI agents.

Piggybacks on [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) credentials -- no separate login needed. Inspired by [weclaw](https://github.com/fastclaw-ai/weclaw) (Go).

### Install

```bash
npm install -g @herai/wxclawbot-cli
```

Requires Node.js >= 20.

### Quick Start

```bash
# Send text (default: to the bound user)
wxclawbot send --text "Hello from wxclawbot"

# Send to a specific user
wxclawbot send --to "user@im.wechat" --text "Hello"

# Send an image
wxclawbot send --file ./photo.jpg

# Send a file with caption
wxclawbot send --file ./report.pdf --text "Here's the report"

# Send from URL
wxclawbot send --file "https://example.com/image.png"

# Pipe from stdin
echo "Daily report ready" | wxclawbot send

# Dry run
wxclawbot send --text "test" --dry-run

# JSON output (for agents and pipelines)
wxclawbot send --text "test" --json

# List accounts
wxclawbot accounts
```

### Supported Media Types

| Type | Extensions | How it appears in WeChat |
|------|-----------|------------------------|
| Image | .png .jpg .jpeg .gif .webp .bmp | Inline image |
| Video | .mp4 .mov .webm .mkv .avi | Video player |
| File | everything else | File attachment |

Media is auto-classified by file extension. Files are encrypted (AES-128-ECB) and uploaded to the WeChat CDN.

### Account Discovery

wxclawbot auto-discovers accounts from the openclaw-weixin state directory:

```
~/.openclaw/openclaw-weixin/accounts/{accountId}.json
```

In a typical setup, one openclaw instance binds to one WeixinClawBot. The bound user is used as the default `--to` target.

Override with environment variables:

```bash
export WXCLAW_TOKEN="bot@im.bot:your-token"
export WXCLAW_BASE_URL="https://ilinkai.weixin.qq.com"  # optional
```

### Programmatic Use

```typescript
import { WxClawClient } from "@herai/wxclawbot-cli";
import { resolveAccount } from "@herai/wxclawbot-cli/accounts";

const account = resolveAccount();
const client = new WxClawClient({
  baseUrl: account.baseUrl,
  token: account.token,
  botId: account.botId,
});

await client.sendText("user@im.wechat", "Hello");
await client.sendFile("user@im.wechat", "./photo.jpg", { text: "Check this out" });
```

### Rate Limits

The WeChat bot API has rate limiting. If you hit it (`ret=-2`), wait and retry. This is server-side and shared across all clients using the same bot token.

### License

MIT

---

## 简体中文

向微信用户发送文本、图片、视频和文件。支持从脚本、定时任务或 AI Agent 调用。

复用 [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) 的登录凭证，无需额外登录。灵感来自 [weclaw](https://github.com/fastclaw-ai/weclaw)（Go 版本）。

### 安装

```bash
npm install -g @herai/wxclawbot-cli
```

需要 Node.js >= 20。

### 快速开始

```bash
# 发送文本（默认发给绑定用户）
wxclawbot send --text "你好，来自 wxclawbot"

# 发送图片
wxclawbot send --file ./photo.jpg

# 发送文件 + 文字说明
wxclawbot send --file ./report.pdf --text "请查收报告"

# 从 URL 发送
wxclawbot send --file "https://example.com/image.png"

# 通过管道输入
echo "日报已生成" | wxclawbot send

# JSON 输出（适合脚本和 Agent 调用）
wxclawbot send --text "测试" --json

# 查看账号列表
wxclawbot accounts
```

### 支持的媒体类型

| 类型 | 扩展名 | 微信中的显示 |
|------|--------|------------|
| 图片 | .png .jpg .jpeg .gif .webp .bmp | 内联图片 |
| 视频 | .mp4 .mov .webm .mkv .avi | 视频播放器 |
| 文件 | 其他所有类型 | 文件附件 |

媒体文件按扩展名自动分类。文件经 AES-128-ECB 加密后上传至微信 CDN。

### 账号发现

wxclawbot 自动从 openclaw-weixin 状态目录读取账号：

```
~/.openclaw/openclaw-weixin/accounts/{accountId}.json
```

通常一个 openclaw 实例绑定一个 WeixinClawBot，绑定用户自动作为默认发送目标。

### 频率限制

微信机器人 API 有频率限制。遇到 `ret=-2` 时，稍等后重试即可。

### 开源许可

MIT
