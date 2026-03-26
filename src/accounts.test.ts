import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { listAccountIds, loadAccountData, resolveAccount } from "./accounts.js";

describe("loadAccountData", () => {
  it("rejects path traversal", () => {
    assert.equal(loadAccountData("../../etc/passwd"), null);
    assert.equal(loadAccountData("foo/bar"), null);
    assert.equal(loadAccountData("foo\\bar"), null);
  });

  it("returns null for nonexistent account", () => {
    assert.equal(loadAccountData("nonexistent-account-xyz"), null);
  });
});

describe("resolveAccount", () => {
  it("returns null when no accounts exist and no env vars", () => {
    const origToken = process.env.WXCLAW_TOKEN;
    const origState = process.env.OPENCLAW_STATE_DIR;
    delete process.env.WXCLAW_TOKEN;
    process.env.OPENCLAW_STATE_DIR = "/tmp/wxclaw-test-nonexistent";
    try {
      assert.equal(resolveAccount(), null);
    } finally {
      if (origToken) process.env.WXCLAW_TOKEN = origToken;
      else delete process.env.WXCLAW_TOKEN;
      if (origState) process.env.OPENCLAW_STATE_DIR = origState;
      else delete process.env.OPENCLAW_STATE_DIR;
    }
  });

  it("uses WXCLAW_TOKEN env var when set", () => {
    const origToken = process.env.WXCLAW_TOKEN;
    process.env.WXCLAW_TOKEN = "bot@im.bot:secret123";
    try {
      const account = resolveAccount();
      assert.ok(account);
      assert.equal(account.id, "env");
      assert.equal(account.token, "bot@im.bot:secret123");
      assert.equal(account.botId, "bot@im.bot");
      assert.equal(account.baseUrl, "https://ilinkai.weixin.qq.com");
    } finally {
      if (origToken) process.env.WXCLAW_TOKEN = origToken;
      else delete process.env.WXCLAW_TOKEN;
    }
  });

  it("explicit --account overrides WXCLAW_TOKEN", () => {
    const origToken = process.env.WXCLAW_TOKEN;
    const origState = process.env.OPENCLAW_STATE_DIR;
    process.env.WXCLAW_TOKEN = "env-token";

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "wxclaw-test-"));
    const stateDir = path.join(tmpDir, "openclaw-weixin");
    const accountsDir = path.join(stateDir, "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(
      path.join(accountsDir, "test-bot.json"),
      JSON.stringify({ token: "file-token:secret", baseUrl: "", userId: "file-bot@im.bot" }),
    );
    fs.writeFileSync(
      path.join(stateDir, "accounts.json"),
      JSON.stringify(["test-bot"]),
    );
    process.env.OPENCLAW_STATE_DIR = tmpDir;

    try {
      const account = resolveAccount("test-bot");
      assert.ok(account);
      assert.equal(account.id, "test-bot");
      assert.equal(account.token, "file-token:secret");
      assert.equal(account.botId, "file-bot@im.bot");
    } finally {
      if (origToken) process.env.WXCLAW_TOKEN = origToken;
      else delete process.env.WXCLAW_TOKEN;
      if (origState) process.env.OPENCLAW_STATE_DIR = origState;
      else delete process.env.OPENCLAW_STATE_DIR;
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe("listAccountIds", () => {
  it("falls back to directory scan when index is missing", () => {
    const origState = process.env.OPENCLAW_STATE_DIR;
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "wxclaw-test-"));
    const accountsDir = path.join(tmpDir, "openclaw-weixin", "accounts");
    fs.mkdirSync(accountsDir, { recursive: true });
    fs.writeFileSync(path.join(accountsDir, "bot-a.json"), "{}");
    fs.writeFileSync(path.join(accountsDir, "bot-b.json"), "{}");
    fs.writeFileSync(path.join(accountsDir, "bot-c.sync.json"), "{}");
    process.env.OPENCLAW_STATE_DIR = tmpDir;

    try {
      const ids = listAccountIds();
      assert.ok(ids.includes("bot-a"));
      assert.ok(ids.includes("bot-b"));
      assert.ok(!ids.includes("bot-c.sync"));
    } finally {
      if (origState) process.env.OPENCLAW_STATE_DIR = origState;
      else delete process.env.OPENCLAW_STATE_DIR;
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
