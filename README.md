# @herai/wxclawbot-cli

[English](./README.en.md)

通过 WeixinClawBot 向微信用户主动发送文本、图片、视频和文件。

给 OpenClaw agent、脚本和定时任务用。复用 [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) 登录凭证，无需额外登录。

## 为什么做这个

> 7）现在还不支持主动定时给你发消息
> 也就是说，它不会像小秘书一样，自己跳出来提醒你。
>
> — [龙虾 🦞 接入微信教程](https://mp.weixin.qq.com/s/nYDQ1obQEHe1WavGpNzasQ)

现在可以了。这个 CLI 让你的 OpenClaw agent 拥有主动推送能力——按自己的节奏给微信用户发文本、文件、图片、视频，不再只能被动回复。

## 安装

```bash
clawhub install wxclawbot-send
```

或通过 npm:

```bash
npm install -g @herai/wxclawbot-cli
```

需要 Node.js >= 20。

## 用法

```bash
wxclawbot send --text "你好" --json
wxclawbot send --file ./photo.jpg --json
wxclawbot send --file ./report.pdf --text "请查收" --json
wxclawbot send --to "user@im.wechat" --text "你好" --json
echo "日报已生成" | wxclawbot send --json
```

默认发送目标是 openclaw 账号绑定的用户。用 `--to` 指定其他用户。

媒体类型按扩展名自动识别：图片 (.png .jpg .jpeg .gif .webp .bmp)，视频 (.mp4 .mov .webm .mkv .avi)，文件（其他）。

## 输出

始终使用 `--json`，解析 `ok` 字段判断是否成功。

```json
{"ok":true,"to":"user@im.wechat","clientId":"..."}
{"ok":false,"error":"ret=-2 (rate limited, try again later)"}
```

退出码 0 只表示 CLI 正常运行，不代表消息已送达。务必检查 `ok` 字段。

## 错误处理

| ret | 含义 | 处理 |
|-----|------|------|
| -2 | 频率限制 | 等 5-10 秒重试，不要紧循环 |
| -14 | 会话过期 | 通过 openclaw 重新登录 |

频率限制：每个机器人账号约 7 条 / 5 分钟，服务端限制，所有客户端共享。

## 账号

```bash
wxclawbot accounts --json
```

自动从 `~/.openclaw/openclaw-weixin/accounts/` 发现账号。可通过环境变量覆盖：

```bash
export WXCLAW_TOKEN="bot@im.bot:your-token"
export WXCLAW_BASE_URL="https://ilinkai.weixin.qq.com"
```

## 编程接口

```typescript
import { WxClawClient } from "@herai/wxclawbot-cli";
import { resolveAccount } from "@herai/wxclawbot-cli/accounts";

const account = resolveAccount();
const client = new WxClawClient({
  baseUrl: account.baseUrl,
  token: account.token,
  botId: account.botId,
});

await client.sendText("user@im.wechat", "你好");
await client.sendFile("user@im.wechat", "./photo.jpg", { text: "请查收" });
```

## 开源许可

MIT
