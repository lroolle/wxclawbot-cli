#!/usr/bin/env node

import { readFileSync } from "node:fs";

import { Command } from "commander";

import { listAccounts, resolveAccount } from "./accounts.js";
import { WxClawClient } from "./client.js";
import { VERSION } from "./version.js";

function readStdin(): string {
  return readFileSync(0, "utf-8").trim();
}

function fail(msg: string, json?: boolean): never {
  if (json) {
    console.log(JSON.stringify({ ok: false, error: msg }));
  } else {
    console.error(msg);
  }
  process.exit(1);
}

const program = new Command();

program
  .name("wxclaw")
  .description("WeChat ClawBot CLI - proactive messaging")
  .version(VERSION);

program
  .command("send")
  .description("Send a text message to a WeChat user")
  .option("--to <userId>", "target user ID (default: bound user from account)")
  .option("--text <message>", 'message text (use "-" to read from stdin)')
  .option("--account <id>", "account ID (default: first available)")
  .option("--json", "output result as JSON")
  .option("--dry-run", "preview without sending")
  .argument("[text...]", "message text (alternative to --text)")
  .action(
    async (
      args: string[],
      opts: {
        to?: string;
        text?: string;
        account?: string;
        json?: boolean;
        dryRun?: boolean;
      },
    ) => {
      let text = opts.text;
      if (text === "-") {
        text = readStdin();
      } else if (!text && args.length > 0) {
        text = args.join(" ");
      } else if (!text) {
        if (!process.stdin.isTTY) {
          text = readStdin();
        }
      }

      if (!text) {
        fail(
          "no message text. use --text, positional args, or pipe via stdin.",
          opts.json,
        );
      }

      const account = resolveAccount(opts.account);
      if (!account) {
        fail(
          "no account found. login via openclaw first, or set WXCLAW_TOKEN env var.",
          opts.json,
        );
      }

      const to = opts.to || account.defaultTo;
      if (!to) {
        fail(
          "no --to specified and no default user bound to this account.",
          opts.json,
        );
      }

      const client = new WxClawClient({
        baseUrl: account.baseUrl,
        token: account.token,
        botId: account.botId,
      });

      try {
        const result = await client.sendText(to, text, {
          dryRun: opts.dryRun,
        });

        if (opts.json) {
          console.log(JSON.stringify(result));
        } else if (result.ok) {
          const prefix = opts.dryRun ? "[dry-run] would send" : "sent";
          console.log(`${prefix} to ${to}`);
        } else {
          console.error(`send failed: ${result.error}`);
          process.exit(1);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        fail(`send failed: ${msg}`, opts.json);
      }
    },
  );

program
  .command("accounts")
  .description("List available OpenClaw WeChat accounts")
  .option("--json", "output as JSON")
  .action((opts: { json?: boolean }) => {
    const accounts = listAccounts();
    if (opts.json) {
      console.log(JSON.stringify(accounts));
      return;
    }
    if (accounts.length === 0) {
      console.log("no accounts found. login via openclaw first.");
      return;
    }
    for (const a of accounts) {
      const status = a.configured ? "ok" : "no token";
      console.log(`  ${a.id}  [${status}]  ${a.baseUrl}`);
    }
  });

program.parse();
