---
name: wxclaw-send
description: Send proactive messages to WeChat users via wxclaw-cli
version: 0.1.0
tools:
  - bash
triggers:
  - send wechat message
  - send wx message
  - wxclaw send
  - message wechat user
  - proactive wechat
---

# wxclaw-send

Send proactive text messages to WeChat users through the wxclaw-cli tool.

## Prerequisites

wxclaw-cli must be installed globally:

```bash
npm install -g wxclaw-cli
```

An openclaw-weixin account must be logged in (credentials at `~/.openclaw/openclaw-weixin/accounts/`).

## Usage

### Send to default bound user

```bash
wxclaw send --text "Your message here"
```

### Send to specific user

```bash
wxclaw send --to "user_id@im.wechat" --text "Your message here"
```

### Pipe content from stdin

```bash
echo "Content here" | wxclaw send
```

### JSON output for programmatic use

```bash
wxclaw send --text "hello" --json
# {"ok":true,"to":"user@im.wechat","clientId":"uuid"}
```

### Dry run

```bash
wxclaw send --text "test" --dry-run
```

### List available accounts

```bash
wxclaw accounts --json
```

## Behavior

- Default `--to` is the bound WeChat user from the openclaw-weixin account (1:1 bot setup)
- Returns exit code 0 on success, 1 on failure
- `--json` flag outputs structured JSON on stdout for all outcomes
- Rate limited by the WeChat bot API; `ret=-2` means try again later
- Credentials auto-discovered from `~/.openclaw/openclaw-weixin/accounts/`
- Override with `WXCLAW_TOKEN` and `WXCLAW_BASE_URL` env vars
