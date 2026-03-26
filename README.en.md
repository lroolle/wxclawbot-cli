# @herai/wxclawbot-cli

[简体中文](./README.md)

Send text, images, video, and files to WeChat users via WeixinClawBot.

For OpenClaw agents, scripts, and cron jobs. Reuses [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) credentials.

## Why

WeChat's official bot API doesn't support proactive messaging — bots can only reply, never initiate. This CLI fixes that. Your OpenClaw agent can now send messages on its own schedule.

## Install

```bash
clawhub install wxclawbot-send
```

Or via npm:

```bash
npm install -g @herai/wxclawbot-cli
```

Node.js >= 20.

## Usage

```bash
wxclawbot send --text "Hello" --json
wxclawbot send --file ./photo.jpg --json
wxclawbot send --file ./report.pdf --text "See attached" --json
wxclawbot send --to "user@im.wechat" --text "Hello" --json
echo "report ready" | wxclawbot send --json
```

Default `--to` is the bound user from the openclaw account.

Media type auto-detected: image (.png .jpg .jpeg .gif .webp .bmp), video (.mp4 .mov .webm .mkv .avi), file (everything else).

## Output

Always use `--json`. Parse `ok` to determine success.

```json
{"ok":true,"to":"user@im.wechat","clientId":"..."}
{"ok":false,"error":"ret=-2 (rate limited, try again later)"}
```

Exit 0 means the CLI ran, not that the message was delivered. Check the `ok` field.

## Errors

| ret | meaning | action |
|-----|---------|--------|
| -2 | rate limited | wait 5-10s, retry |
| -14 | session expired | re-login via openclaw |

Rate limit: ~7 msgs / 5 min per bot account, server-side, shared across all clients.

## Accounts

```bash
wxclawbot accounts --json
```

Auto-discovers from `~/.openclaw/openclaw-weixin/accounts/`. Override with env:

```bash
export WXCLAW_TOKEN="bot@im.bot:your-token"
export WXCLAW_BASE_URL="https://ilinkai.weixin.qq.com"
```

## Programmatic API

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

## License

MIT
