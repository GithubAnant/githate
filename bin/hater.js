#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

const program = new Command();

program
  .name("githate")
  .description("Track who unfollowed you on GitHub")
  .version(pkg.version);

program
  .command("login")
  .description("Login to GitHub with a Personal Access Token")
  .action(async () => {
    const { login } = await import("../lib/commands/login.js");
    await login();
  });

program
  .command("check")
  .description("Check for new unfollowers")
  .action(async () => {
    const { check } = await import("../lib/commands/check.js");
    await check();
  });

program
  .command("followers")
  .description("List your followers")
  .action(async () => {
    const { followers } = await import("../lib/commands/followers.js");
    await followers();
  });

program
  .command("following")
  .description("List who you are following")
  .action(async () => {
    const { following } = await import("../lib/commands/following.js");
    await following();
  });

program
  .command("follow <username>")
  .description("Follow a user")
  .action(async (username) => {
    const { follow } = await import("../lib/commands/follow.js");
    await follow(username);
  });

program
  .command("unfollow <username>")
  .description("Unfollow a user")
  .action(async (username) => {
    const { unfollow } = await import("../lib/commands/unfollow.js");
    await unfollow(username);
  });

program
  .command("start")
  .description("Start the background tracking service")
  .option("-i, --interval <number>", "Polling interval in minutes", "720")
  .action(async (cmd) => {
    const { start } = await import("../lib/commands/daemon-control.js");
    await start(parseInt(cmd.interval));
  });

program
  .command("stop")
  .description("Stop the background tracking service")
  .action(async () => {
    const { stop } = await import("../lib/commands/daemon-control.js");
    await stop();
  });

program
  .command("status")
  .description("Check the status of the background service")
  .action(async () => {
    const { status } = await import("../lib/commands/daemon-control.js");
    await status();
  });

// Hidden command for the actual background process
program
  .command("__daemon", { hidden: true })
  .option("-i, --interval <number>", "Polling interval", "10")
  .action(async (cmd) => {
    // In daemon mode, we silence stdout/stderr mostly,
    // but the watch command might need adjustment to not try to render UI
    const { watch } = await import("../lib/commands/watch.js");
    // Pass a flag or env var to indicate daemon mode if needed,
    // but cleaner is to rely on GITHATE_DAEMON env var we set in daemon.js
    await watch(parseInt(cmd.interval));
  });

program
  .command("logout")
  .description("Logout and clear stored credentials")
  .action(async () => {
    const { logout } = await import("../lib/commands/logout.js");
    await logout();
  });

// Handle default command (REPL mode)
if (process.argv.length < 3) {
  const { repl } = await import("../lib/commands/repl.js");
  await repl();
} else {
  // Load art for help command
  import("../lib/ui/art.js").then(({ getBanner }) => {
    program.addHelpText("before", getBanner());
    program.parse(process.argv);
  });
}
