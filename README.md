# @herai/wxclawbot-cli

Send text, images, video, and files to WeChat users via WeixinClawBot.

For OpenClaw agents, scripts, and cron jobs. Reuses [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) credentials.

## Why

> 7）现在还不支持主动定时给你发消息
> 也就是说，它不会像小秘书一样，自己跳出来提醒你。

Now it can. This CLI gives your OpenClaw agent proactive messaging — send text, files, images, video to WeChat users on its own schedule, not just in response to user messages.

Setup guide: [龙虾 🦞 接入微信教程](https://mp.weixin.qq.com/s/nYDQ1obQEHe1WavGpNzasQ)

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

Exit 0 means the CLI ran, not that the message was delivered.

## Errors

| ret | meaning | action |
|-----|---------|--------|
| -2 | rate limited | wait 5-10s, retry |
| -14 | session expired | re-login via openclaw |

Rate limit: ~7 msgs / 5 min per bot account, server-side.

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

---

## 简体中文

通过 WeixinClawBot 向微信用户发送文本、图片、视频和文件。

给 OpenClaw agent、脚本和定时任务用。复用 [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) 登录凭证。

### 为什么做这个

> 7）现在还不支持主动定时给你发消息
> 也就是说，它不会像小秘书一样，自己跳出来提醒你。

现在可以了。这个 CLI 让你的 OpenClaw agent 拥有主动推送能力——按自己的节奏给微信用户发文本、文件、图片、视频，不再只能被动回复。

接入教程：[龙虾 🦞 接入微信教程](https://mp.weixin.qq.com/s/nYDQ1obQEHe1WavGpNzasQ)

### 安装

```bash
clawhub install wxclawbot-send
```

或通过 npm:

```bash
npm install -g @herai/wxclawbot-cli
```

需要 Node.js >= 20。

### 用法

```bash
wxclawbot send --text "你好" --json
wxclawbot send --file ./photo.jpg --json
wxclawbot send --file ./report.pdf --text "请查收" --json
echo "日报已生成" | wxclawbot send --json
wxclawbot accounts --json
```

默认发送目标是 openclaw 账号绑定的用户。

### 错误处理

| ret | 含义 | 处理 |
|-----|------|------|
| -2 | 频率限制 | 等 5-10 秒重试 |
| -14 | 会话过期 | 通过 openclaw 重新登录 |

频率限制：每个机器人账号约 7 条 / 5 分钟，服务端限制。

### 开源许可

MIT
