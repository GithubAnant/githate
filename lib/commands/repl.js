import { createInterface } from "node:readline";
import chalk from "chalk";
import { displayIntro } from "../ui/display.js";
import { getBanner } from "../ui/art.js";

/**
 * Launch the legacy interactive select-menu UI.
 */
async function launchInteractiveMenu() {
  const { select, isCancel, text } = await import("@clack/prompts");

  while (true) {
    console.clear();
    displayIntro();

    const command = await select({
      message: "What would you like to do?",
      options: [
        { value: "check", label: "🕵️  Check for Haters" },
        { value: "login", label: "🔑 Login" },
        { value: "followers", label: "👥 List Followers" },
        { value: "following", label: "👀 List Following" },
        { value: "start", label: "🚀 Start Background Service" },
        { value: "stop", label: "🛑 Stop Background Service" },
        { value: "status", label: "📊 Service Status" },
        { value: "logout", label: "👋 Logout" },
        { value: "quit", label: "🚪 Quit" },
      ],
    });

    if (isCancel(command) || command === "quit") {
      return; // Return to REPL instead of exiting
    }

    await dispatchCommand(command);

    await text({
      message: "Press Enter to return to menu...",
      placeholder: "",
    });
  }
}

/**
 * Dispatch a command string to its handler.
 */
async function dispatchCommand(cmd, args = []) {
  switch (cmd) {
    case "check":
    case "haters": {
      const { check } = await import("./check.js");
      await check();
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
        return;
      }
      const { follow } = await import("./follow.js");
      await follow(args[0]);
      break;
    }
    case "unfollow": {
      if (!args[0]) {
        console.log(chalk.yellow("  Usage: /unfollow <username>"));
        return;
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
 * Display REPL help — all available slash commands.
 */
function displayREPLHelp() {
  console.log("");
  console.log(chalk.bold("  Available Commands:"));
  console.log("");
  console.log(
    `  ${chalk.cyan("/check")}              ${chalk.dim("Check for new unfollowers")}`,
  );
  console.log(
    `  ${chalk.cyan("/haters")}             ${chalk.dim("Alias for /check")}`,
  );
  console.log(
    `  ${chalk.cyan("/followers")}          ${chalk.dim("List your followers")}`,
  );
  console.log(
    `  ${chalk.cyan("/following")}          ${chalk.dim("List who you are following")}`,
  );
  console.log(
    `  ${chalk.cyan("/follow <user>")}      ${chalk.dim("Follow a user")}`,
  );
  console.log(
    `  ${chalk.cyan("/unfollow <user>")}    ${chalk.dim("Unfollow a user")}`,
  );
  console.log(
    `  ${chalk.cyan("/login")}              ${chalk.dim("Login to GitHub")}`,
  );
  console.log(`  ${chalk.cyan("/logout")}             ${chalk.dim("Logout")}`);
  console.log(
    `  ${chalk.cyan("/start")}              ${chalk.dim("Start background tracking service")}`,
  );
  console.log(
    `  ${chalk.cyan("/stop")}               ${chalk.dim("Stop background tracking service")}`,
  );
  console.log(
    `  ${chalk.cyan("/status")}             ${chalk.dim("Check background service status")}`,
  );
  console.log(
    `  ${chalk.cyan("/interactive")}        ${chalk.dim("Launch the interactive menu")}`,
  );
  console.log(
    `  ${chalk.cyan("/clear")}              ${chalk.dim("Clear the screen")}`,
  );
  console.log(
    `  ${chalk.cyan("/quit")}               ${chalk.dim("Exit githate")}`,
  );
  console.log("");
}

/**
 * Display a compact welcome message for the REPL.
 */
function displayREPLWelcome() {
  console.clear();
  console.log(getBanner());
  console.log(
    chalk.dim("  Type ") +
      chalk.cyan("/help") +
      chalk.dim(" for commands. ") +
      chalk.dim("Press ") +
      chalk.cyan("Ctrl+C") +
      chalk.dim(" to exit."),
  );
  console.log("");
}

/**
 * The main REPL entry point.
 */
export async function repl() {
  displayREPLWelcome();

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${chalk.green("githate")} ${chalk.dim(">")} `,
    terminal: true,
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();

    if (!input) {
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

    if (cmd === "clear") {
      console.clear();
      console.log(getBanner());
      console.log("");
      rl.prompt();
      return;
    }

    if (cmd === "quit" || cmd === "exit") {
      console.log(chalk.dim("\n  👋 See you later!\n"));
      rl.close();
      process.exit(0);
    }

    if (cmd === "interactive") {
      rl.pause();
      await launchInteractiveMenu();
      // When they exit interactive, come back to REPL
      console.log("");
      rl.resume();
      rl.prompt();
      return;
    }

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

    rl.prompt();
  });

  rl.on("close", () => {
    console.log(chalk.dim("\n  👋 See you later!\n"));
    process.exit(0);
  });
}
