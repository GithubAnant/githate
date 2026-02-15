import { createInterface } from "node:readline";
import chalk from "chalk";
import { displayIntro, displayHater, link } from "../ui/display.js";
import { getBanner } from "../ui/art.js";
import {
  displayWhy,
  displayREPLHelp,
  displayREPLWelcome,
} from "../ui/repl-text.js";

/**
 * Dispatch a command string to its handler.
 */
async function dispatchCommand(cmd, args = []) {
  switch (cmd) {
    case "scan": {
      const { scan } = await import("./scan.js");
      await scan();
      break;
    }
    case "login": {
      const { login } = await import("./login.js");
      await login();
      break;
    }
    case "logout": {
      const { logout } = await import("./logout.js");
      await logout();
      break;
    }
    case "followers": {
      const { followers } = await import("./followers.js");
      await followers();
      break;
    }
    case "following": {
      const { following } = await import("./following.js");
      await following();
      break;
    }
    case "follow": {
      if (!args[0]) {
        console.log(chalk.yellow("  Usage: /follow <username>"));
        return true;
      }
      const { follow } = await import("./follow.js");
      await follow(args[0]);
      break;
    }
    case "unfollow": {
      if (!args[0]) {
        console.log(chalk.yellow("  Usage: /unfollow <username>"));
        return true;
      }
      const { unfollow } = await import("./unfollow.js");
      await unfollow(args[0]);
      break;
    }
    case "start": {
      const { start } = await import("./daemon-control.js");
      await start(720);
      break;
    }
    case "stop": {
      const { stop } = await import("./daemon-control.js");
      await stop();
      break;
    }
    case "status": {
      const { status } = await import("./daemon-control.js");
      await status();
      break;
    }
    default:
      return false;
  }
  return true;
}

/**
 * The main REPL entry point.
 */
export async function repl() {
  await startRepl(true);
}

async function startRepl(showWelcome = true) {
  if (showWelcome) {
    displayREPLWelcome();
  }

  // Ensure stdin is alive — @clack/prompts may have paused/closed it
  if (process.stdin.destroyed) {
    // stdin was destroyed, nothing we can do
    return;
  }
  process.stdin.resume();

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${chalk.green("githate")} ${chalk.dim(">")} `,
    terminal: true,
  });

  // Track whether we're intentionally closing
  let intentionalClose = false;

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    // Hidden Easter Eggs (handle these before the slash check)
    const lowerInput = input.toLowerCase().replace(/^\//, ""); // Remove leading slash if present

    const greetingResponses = {
      sup: "sup bro",
      "what's up": "i'm good chat",
      "whats up": "nm, i'm good gang",
      hello: "yo",
      hi: "yooo",
      hey: "wsg",
      helo: "learn to spell, but yo",
    };

    if (greetingResponses[lowerInput]) {
      console.log("");
      console.log(
        `${chalk.green("➜")}  ${chalk.dim(greetingResponses[lowerInput])}`,
      );
      console.log("");
      rl.prompt();
      return;
    }

    // Must start with /
    if (!input.startsWith("/")) {
      console.log(
        chalk.yellow(
          `\n  Commands start with ${chalk.cyan("/")}. Type ${chalk.cyan("/help")} for a list.\n`,
        ),
      );
      rl.prompt();
      return;
    }

    const parts = input.slice(1).split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Handle built-in REPL commands
    if (cmd === "help") {
      displayREPLHelp();
      rl.prompt();
      return;
    }

    if (cmd === "why") {
      displayWhy();
      rl.prompt();
      return;
    }

    if (cmd === "repo") {
      console.log("");
      console.log(
        "  " +
          link(
            chalk.green("https://github.com/GithubAnant/githate"),
            "https://github.com/GithubAnant/githate",
          ),
      );
      console.log("");
      rl.prompt();
      return;
    }

    if (cmd === "haters") {
      const { displayHaters } = await import("./haters.js");
      await displayHaters();
      rl.prompt();
      return;
    }

    if (cmd === "clearcache") {
      rl.pause();
      const { clearCache } = await import("./clear-cache.js");
      await clearCache();
      try {
        rl.resume();
        rl.prompt();
      } catch {
        // readline closed by @clack/prompts — close handler restarts REPL
      }
      return;
    }

    if (cmd === "clear") {
      console.clear();
      console.log(getBanner());
      console.log("");
      rl.prompt();
      return;
    }

    if (cmd === "quit" || cmd === "exit") {
      console.log(chalk.dim("\n  👋 See you later!\n"));
      intentionalClose = true;
      rl.close();
      process.exit(0);
    }

    // Pause readline so @clack/prompts and other libs don't fight over stdin
    rl.pause();

    // Dispatch to command handlers
    const handled = await dispatchCommand(cmd, args);
    if (!handled) {
      console.log(
        chalk.red(`\n  Unknown command: /${cmd}`) +
          chalk.dim(` — type ${chalk.cyan("/help")} for a list.\n`),
      );
    } else {
      console.log(""); // Breathing room after output
    }

    // Resume readline after command finishes
    // If readline was closed by the command (e.g. @clack/prompts taking stdin),
    // the close handler will restart the REPL automatically.
    try {
      rl.resume();
      rl.prompt();
    } catch {
      // readline was already closed — close handler will restart REPL
    }
  });

  rl.on("close", () => {
    if (!intentionalClose) {
      // Readline was closed by something else (e.g. @clack/prompts).
      // Restart the REPL seamlessly.
      startRepl(false);
      return;
    }
  });
}
