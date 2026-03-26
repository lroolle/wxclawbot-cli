# @herai/wxclaw-cli

```
                  _
 __      ___  __ | | __ ___      __
 \ \ /\ / \ \/ / | |/ _` \ \ /\ / /
  \ V  V /  >  < | | (_| |\ V  V /
   \_/\_/  /_/\_\|_|\__,_| \_/\_/
   WeChat ClawBot CLI
```

[English](#english) | [简体中文](#简体中文)

---

## English

Proactive messaging CLI for WeChat ClawBot. Send messages to WeChat users from scripts, cron jobs, or AI agents.

Piggybacks on [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) credentials -- no separate login needed. Inspired by [weclaw](https://github.com/fastclaw-ai/weclaw) (Go).

### Install

```bash
npm install -g @herai/wxclaw-cli
```

Requires Node.js >= 20.

### Quick Start

```bash
# Send to the default bound user (most common 1:1 bot setup)
wxclaw send --text "Hello from wxclaw"

# Send to a specific user
wxclaw send --to "user@im.wechat" --text "Hello"

# Positional args
wxclaw send --to "user@im.wechat" Hello from wxclaw

# Pipe from stdin (great for scripts)
echo "Daily report ready" | wxclaw send

# Dry run
wxclaw send --text "test" --dry-run

# JSON output (for agents and pipelines)
wxclaw send --text "test" --json

# List accounts
wxclaw accounts
```

### Account Discovery

wxclaw auto-discovers accounts from the openclaw-weixin state directory:

```
~/.openclaw/openclaw-weixin/accounts/{accountId}.json
```

In a typical setup, one openclaw instance binds to one WeChat ClawBot. The bound user is used as the default `--to` target, so you don't need to specify it every time.

Override with environment variables:

```bash
export WXCLAW_TOKEN="bot@im.bot:your-token"
export WXCLAW_BASE_URL="https://ilinkai.weixin.qq.com"  # optional
```

### Programmatic Use

```typescript
import { WxClawClient } from "@herai/wxclaw-cli";
import { resolveAccount } from "@herai/wxclaw-cli/accounts";

const account = resolveAccount();
const client = new WxClawClient({
  baseUrl: account.baseUrl,
  token: account.token,
  botId: account.botId,
});

const result = await client.sendText("user@im.wechat", "Hello");
// { ok: true, to: "...", clientId: "..." }
```

### Rate Limits

The WeChat bot API has rate limiting. If you hit it (`ret=-2`), wait and retry. This is server-side and shared across all clients using the same bot token.

### License

MIT

---

## 简体中文

微信 ClawBot 主动消息发送 CLI 工具。支持从脚本、定时任务或 AI Agent 发送消息给微信用户。

复用 [openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) 的登录凭证，无需额外登录。灵感来自 [weclaw](https://github.com/fastclaw-ai/weclaw)（Go 版本）。

### 安装

```bash
npm install -g @herai/wxclaw-cli
```

需要 Node.js >= 20。

### 快速开始

```bash
# 发送给默认绑定用户（一般一个 openclaw 绑定一个微信 ClawBot）
wxclaw send --text "你好，来自 wxclaw"

# 发送给指定用户
wxclaw send --to "user@im.wechat" --text "你好"

# 通过管道输入
echo "日报已生成" | wxclaw send

# 预览模式（不实际发送）
wxclaw send --text "测试" --dry-run

# JSON 输出（适合脚本和 Agent 调用）
wxclaw send --text "测试" --json

# 查看账号列表
wxclaw accounts
```

### 账号发现

wxclaw 自动从 openclaw-weixin 状态目录读取账号：

```
~/.openclaw/openclaw-weixin/accounts/{accountId}.json
```

通常一个 openclaw 实例绑定一个微信 ClawBot，绑定用户自动作为默认发送目标。

也可通过环境变量覆盖：

```bash
export WXCLAW_TOKEN="bot@im.bot:your-token"
```

### 频率限制

微信机器人 API 有频率限制。遇到 `ret=-2` 时，稍等后重试即可。该限制为服务端行为，同一 bot token 的所有客户端共享额度。

### 开源许可

MIT
