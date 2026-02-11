#!/usr/bin/env node
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

// Handle default command (interactive mode)
if (process.argv.length < 3) {
  (async () => {
    const { select, isCancel, cancel } = await import("@clack/prompts");
    const { displayIntro } = await import("../lib/ui/display.js");

    // Clear screen for a fresh start
    console.clear();
    displayIntro();

    const command = await select({
      message: "What would you like to do?",
      options: [
        { value: "check", label: "🕵️  Check for Haters" },
        { value: "login", label: "🔑 Login" },
        { value: "followers", label: "👥 List Followers" },
        { value: "following", label: "👀 List Following" },
        { value: "quit", label: "🚪 Quit" },
      ],
    });

    if (isCancel(command) || command === "quit") {
      cancel("Bye!");
      process.exit(0);
    }

    if (command === "check") {
      const { check } = await import("../lib/commands/check.js");
      await check();
    } else if (command === "login") {
      const { login } = await import("../lib/commands/login.js");
      await login();
    } else if (command === "followers") {
      const { followers } = await import("../lib/commands/followers.js");
      await followers();
    } else if (command === "following") {
      const { following } = await import("../lib/commands/following.js");
      await following();
    }
  })();
} else {
  program.parse(process.argv);
}
