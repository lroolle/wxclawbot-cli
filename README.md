# @herai/wxclawbot-cli

```
                  _             _           _
 __      ___  __| | __ ___   _| |__   ___ | |_
 \ \ /\ / \ \/ /| |/ _` \ \ / / '_ \ / _ \| __|
  \ V  V /  >  <| | (_| |\ V /| |_) | (_) | |_
   \_/\_/ /_/\_\|_|\__,_| \_/ |_.__/ \___/ \__|
   WeixinClawBot CLI
```

## For AI Agents

You are an AI agent that needs to send messages to WeChat users.
Use `wxclawbot` — a CLI that sends text, images, video, and files via the WeixinClawBot API.

### Setup Check

```bash
wxclawbot accounts --json
```

If empty: credentials missing. The human must login via openclaw-weixin first.
Credentials live at `~/.openclaw/openclaw-weixin/accounts/`.

### Send Text

```bash
wxclawbot send --text "Your task is complete" --json
```

### Send File (image, video, or attachment)

```bash
wxclawbot send --file ./chart.png --json
wxclawbot send --file ./report.pdf --text "See attached" --json
wxclawbot send --file "https://example.com/image.png" --json
```

Media type is auto-detected by extension:
- Image: `.png` `.jpg` `.jpeg` `.gif` `.webp` `.bmp`
- Video: `.mp4` `.mov` `.webm` `.mkv` `.avi`
- File: everything else

### Send to a Specific User

```bash
wxclawbot send --to "user@im.wechat" --text "Hello" --json
```

Default `--to` is the bound user from the openclaw account.

### Pipe from stdin

```bash
echo "Daily report ready" | wxclawbot send --json
```

### Dry Run

```bash
wxclawbot send --text "test" --dry-run
```

### Parse the Output

ALWAYS use `--json`. Parse the JSON to determine success.

```
Success: {"ok":true,"to":"user@im.wechat","clientId":"..."}
Failure: {"ok":false,"error":"..."}
```

Exit code 0 means the CLI ran, NOT that the message was delivered. Check the `ok` field.

### Error Handling

| `ret` | Meaning | Action |
|-------|---------|--------|
| `-2` | Rate limited | Wait 5-10s, retry. Do NOT tight-loop. |
| `-14` | Session expired | Tell the human to re-login via openclaw. |
| CDN error | File upload failed | Check file size (<100MB), retry. |
| Timeout | Network (15s limit) | Retry. |

Rate limits are ~7 msgs per 5 min per bot account. Server-side, shared across all clients.

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `WXCLAW_TOKEN` | Override bot token (`bot@im.bot:your-token`) |
| `WXCLAW_BASE_URL` | Override API endpoint (default: `https://ilinkai.weixin.qq.com`) |

### Programmatic TypeScript API

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
await client.sendFile("user@im.wechat", "./photo.jpg", { text: "Check this" });
```

---

## For Humans

Send text, images, video, and files to WeChat users from scripts, cron jobs, or AI agents.

Piggybacks on [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) credentials — no separate login needed. Inspired by [weclaw](https://github.com/fastclaw-ai/weclaw) (Go).

### Install

```bash
npm install -g @herai/wxclawbot-cli
```

Requires Node.js >= 20.

### Quick Start

```bash
wxclawbot send --text "Hello from wxclawbot"
wxclawbot send --to "user@im.wechat" --text "Hello"
wxclawbot send --file ./photo.jpg
wxclawbot send --file ./report.pdf --text "Here's the report"
wxclawbot send --file "https://example.com/image.png"
echo "Daily report ready" | wxclawbot send
wxclawbot send --text "test" --dry-run
wxclawbot send --text "test" --json
wxclawbot accounts
```

### Account Discovery

wxclawbot auto-discovers accounts from the openclaw-weixin state directory:

```
~/.openclaw/openclaw-weixin/accounts/{accountId}.json
```

One openclaw instance binds to one WeixinClawBot. The bound user is the default `--to` target.

Override with environment variables:

```bash
export WXCLAW_TOKEN="bot@im.bot:your-token"
export WXCLAW_BASE_URL="https://ilinkai.weixin.qq.com"  # optional
```

### Rate Limits

The WeChat bot API has rate limiting (~7 msgs per 5 min per bot account). If you hit `ret=-2`, wait 5-10s and retry. This is server-side and shared across all clients using the same bot token.

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
wxclawbot send --text "你好，来自 wxclawbot"
wxclawbot send --file ./photo.jpg
wxclawbot send --file ./report.pdf --text "请查收报告"
echo "日报已生成" | wxclawbot send
wxclawbot send --text "测试" --json
wxclawbot accounts
```

### 频率限制

微信机器人 API 有频率限制（每个机器人账号约 7 条/5 分钟）。遇到 `ret=-2` 时，等待 5-10 秒后重试。

### 开源许可

MIT
