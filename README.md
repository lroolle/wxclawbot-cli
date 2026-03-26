# wxclaw-cli

Proactive messaging CLI for WeChat ClawBot. Send messages to WeChat users from scripts, agents, or cron jobs.

Piggybacks on [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) credentials -- no separate login required.

## Install

```bash
npm install -g wxclaw-cli
```

Requires Node.js >= 20.

## Usage

```bash
# Send a text message
wxclaw send --to "user@im.wechat" --text "Hello from wxclaw"

# Positional args
wxclaw send --to "user@im.wechat" Hello from wxclaw

# Pipe from stdin
echo "Report ready" | wxclaw send --to "user@im.wechat"

# Dry run (preview without sending)
wxclaw send --to "user@im.wechat" --text "test" --dry-run

# JSON output (for scripts/agents)
wxclaw send --to "user@im.wechat" --text "test" --json

# List available accounts
wxclaw accounts
```

## Account Discovery

wxclaw auto-discovers accounts from the openclaw-weixin state directory:

```
~/.openclaw/openclaw-weixin/accounts/{accountId}.json
```

Override with environment variables:

```bash
export WXCLAW_TOKEN="bot@im.bot:your-token-here"
export WXCLAW_BASE_URL="https://ilinkai.weixin.qq.com"  # optional
```

If both env var and `--account` flag are set, `--account` wins.

## Programmatic Use

```typescript
import { WxClawClient } from "wxclaw-cli";
import { resolveAccount } from "wxclaw-cli/accounts";

const account = resolveAccount();
const client = new WxClawClient({
  baseUrl: account.baseUrl,
  token: account.token,
  botId: account.botId,
});

const result = await client.sendText("user@im.wechat", "Hello");
console.log(result); // { ok: true, to: "...", clientId: "..." }
```

## Rate Limits

The WeChat bot API enforces ~7 messages per 5-minute window per bot account. This is server-side and shared across all clients using the same token. `ret=-2` means rate limited.

## License

MIT
