# @herai/wxclawbot-cli

[简体中文](./README.md) | [npm](https://www.npmjs.com/package/@herai/wxclawbot-cli) | [GitHub](https://github.com/lroolle/wxclawbot-cli) | [ClawHub](https://clawhub.ai/lroolle/wxclawbot-send)

Let your OpenClaw AI agent proactively send WeChat messages. Text, images, video, files.

## Why This Exists

WeChat's bot API only supports replies -- bots can't initiate. This skill fixes that. Your agent can now send messages on its own schedule.

> "Currently doesn't support proactively sending you messages on a schedule"
>
> -- [Lobster's WeChat Integration Tutorial](https://mp.weixin.qq.com/s/nYDQ1obQEHe1WavGpNzasQ)

## How It Works

### 1. Install the skill

```bash
clawhub install wxclawbot-send
```

### 2. Just talk to your agent

No code, no cron config, no CLI. The agent handles scheduling and invocation internally.

**Life reminders:**

> Remind me to drink water every 45 minutes, be blunt about it
>
> Every hour of sitting, tell me to stand up
>
> If I'm still chatting with you after 1 AM, tell me to go to sleep
>
> Friday 5:55 PM, remind me to stop working and leave
>
> Weekdays 11:15, remind me to order lunch before delivery backs up

**DevOps alerts:**

> When CI breaks, WeChat me immediately with whose commit caused it
>
> If a PR sits unreviewed for 24 hours, ping me
>
> Notify me on every deploy, success or failure
>
> If production error rate exceeds 1%, alert me via WeChat immediately

**Business ops:**

> Send me yesterday's key metrics summary every morning at 9
>
> Auto-escalate tickets that exceed SLA by 4 hours
>
> Alert me on suspicious logins immediately
>
> Notify me when any server disk exceeds 90%

That's it. You talk, the agent works.

## Install

```bash
clawhub install wxclawbot-send
```

Or via npm:

```bash
npm install -g @herai/wxclawbot-cli
```

Requires Node.js >= 20, openclaw-weixin logged in.

## CLI Reference (for agents and scripts)

```bash
wxclawbot send --text "message" --json
wxclawbot send --file ./photo.jpg --json
wxclawbot send --file ./report.pdf --text "See attached" --json
wxclawbot send --to "user@im.wechat" --text "Hello" --json
echo "report ready" | wxclawbot send --json
```

- `--to` defaults to the bound user from the openclaw account
- `--json` always use this
- Media type auto-detected: image (.png .jpg .jpeg .gif .webp .bmp), video (.mp4 .mov .webm .mkv .avi), file (everything else)

Output:

```json
{"ok":true,"to":"user@im.wechat","clientId":"..."}
{"ok":false,"error":"ret=-2 (rate limited, try again later)"}
```

| ret | meaning | action |
|-----|---------|--------|
| -2 | rate limited | wait 5-10s, retry |
| -14 | session expired | re-login via openclaw |

Rate limit: **~7 msgs / 5 min** per bot account, server-side.

## Accounts

```bash
wxclawbot accounts --json
```

Auto-discovers from `~/.openclaw/openclaw-weixin/accounts/`. Env override:

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

## Links

- [npm](https://www.npmjs.com/package/@herai/wxclawbot-cli)
- [GitHub](https://github.com/lroolle/wxclawbot-cli)
- [ClawHub](https://clawhub.ai/lroolle/wxclawbot-send) -- `clawhub install wxclawbot-send`
- [WeChat Integration Tutorial](https://mp.weixin.qq.com/s/nYDQ1obQEHe1WavGpNzasQ) -- start here

## License

MIT
