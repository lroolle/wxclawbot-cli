# @herai/wxclawbot-cli

[English](./README.en.md) | [npm](https://www.npmjs.com/package/@herai/wxclawbot-cli) | [GitHub](https://github.com/lroolle/wxclawbot-cli) | [ClawHub](https://clawhub.ai/lroolle/wxclawbot-send)

让你的 OpenClaw AI agent 主动给微信用户发消息。文本、图片、视频、文件，想发就发。

## 为什么做这个

> 7）现在还不支持主动定时给你发消息
> 也就是说，它不会像小秘书一样，自己跳出来提醒你。
>
> -- [龙虾 接入微信教程](https://mp.weixin.qq.com/s/nYDQ1obQEHe1WavGpNzasQ)

**现在可以了。** 装上这个技能，你的 agent 就能主动给你发微信了。定时提醒、监控告警、自动汇报 -- 你只需要用自然语言告诉它该干嘛，剩下的它自己搞定。

## 怎么用

### 1. 给你的 agent 装上技能

```bash
clawhub install wxclawbot-send
```

### 2. 直接跟 agent 说话就行

不用写代码，不用配 cron，不用碰命令行。agent 自己会调用技能、管理定时任务。

**生活提醒：**

> 每 45 分钟微信提醒我喝水，别客气直接骂
>
> 每坐满 1 小时提醒我站起来活动，语气凶一点
>
> 凌晨 1 点以后如果我还在跟你聊天，直接微信骂我去睡觉
>
> 周五下午 5:55 提醒我准备下班，不要接新需求
>
> 工作日 11:15 提醒我点外卖，不然配送排到下午两点

**DevOps 告警：**

> CI 挂了第一时间微信通知我，告诉我是谁的 commit 炸的
>
> 有 PR 超过 24 小时没人 review 就催我
>
> 每次部署完成通知我，成功失败都要说
>
> 生产环境错误率超过 1% 立刻微信告警

**业务运营：**

> 每天早上 9 点把昨天的核心指标汇总发给我
>
> 工单超 SLA 4 小时自动升级通知我
>
> 检测到异常登录立刻微信告警
>
> 服务器磁盘超 90% 通知我

就这样。你说人话，agent 干活。

## 安装

```bash
clawhub install wxclawbot-send
```

或通过 npm：

```bash
npm install -g @herai/wxclawbot-cli
```

需要 Node.js >= 20，openclaw-weixin 已登录。

## CLI 参考（给 agent 和脚本用的）

```bash
wxclawbot send --text "消息内容" --json
wxclawbot send --file ./photo.jpg --json
wxclawbot send --file ./report.pdf --text "请查收" --json
wxclawbot send --to "user@im.wechat" --text "你好" --json
echo "日报已生成" | wxclawbot send --json
```

- `--to` 默认是 openclaw 账号绑定的用户
- `--json` 始终带上
- 媒体类型按扩展名自动识别：图片 (.png .jpg .jpeg .gif .webp .bmp)，视频 (.mp4 .mov .webm .mkv .avi)，文件（其他）

输出：

```json
{"ok":true,"to":"user@im.wechat","clientId":"..."}
{"ok":false,"error":"ret=-2 (rate limited, try again later)"}
```

| ret | 含义 | 处理 |
|-----|------|------|
| -2 | 频率限制 | 等 5-10 秒重试 |
| -14 | 会话过期 | 通过 openclaw 重新登录 |

频率限制：每个机器人账号约 **7 条 / 5 分钟**，服务端限制。

## 账号

```bash
wxclawbot accounts --json
```

自动从 `~/.openclaw/openclaw-weixin/accounts/` 发现。环境变量覆盖：

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

## 相关链接

- [npm](https://www.npmjs.com/package/@herai/wxclawbot-cli)
- [GitHub](https://github.com/lroolle/wxclawbot-cli)
- [ClawHub](https://clawhub.ai/lroolle/wxclawbot-send) -- `clawhub install wxclawbot-send`
- [龙虾接入微信教程](https://mp.weixin.qq.com/s/nYDQ1obQEHe1WavGpNzasQ) -- 先看这个搞定基础接入

## 开源许可

MIT
