import { createInterface } from "node:readline";
import chalk from "chalk";
import { displayIntro, displayHater, link } from "../ui/display.js";
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
    case "check": {
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
 * Display the /why origin story.
 */
function displayWhy() {
  console.log("");
  console.log(chalk.hex("#ff6b6b").bold("  WHY DOES THIS EXIST?"));
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")("  Okay, true story — I opened my GitHub at like ") +
      chalk.hex("#818cf8").bold("1am") +
      chalk.hex("#c4b5fd")(" a week ago"),
  );
  console.log(chalk.hex("#c4b5fd")("  and noticed my follower count dropped."));
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")("  Someone unfollowed. ") +
      chalk.hex("#ff6b6b").bold("(WHY)"),
  );
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")("  And the absolute worst part is you genuinely"),
  );
  console.log(
    chalk.hex("#c4b5fd")("  cannot figure out ") +
      chalk.hex("#818cf8").bold("who it was."),
  );
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")(
      "  Because let's be honest for a second — GitHub followers",
    ),
  );
  console.log(
    chalk.hex("#818cf8").bold("  lowkey matter way more") +
      chalk.hex("#c4b5fd")(" than anyone wants to admit."),
  );
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")(
      "  When someone checks out your profile and sees you have",
    ),
  );
  console.log(
    chalk.hex("#c4b5fd")(
      "  followers, they assume you're doing something right.",
    ),
  );
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")("  But when that number drops — it ") +
      chalk.hex("#ff6b6b").bold("highkey genuinely hurts."),
  );
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")("  So I did what any ") +
      chalk.hex("#818cf8").bold("completely normal and mentally stable") +
      chalk.hex("#c4b5fd")(" developer"),
  );
  console.log(
    chalk.hex("#c4b5fd")("  would do when faced with this cosmic injustice:"),
  );
  console.log("");
  console.log(
    chalk
      .hex("#34d399")
      .bold("  I built an open-source CLI tool to track every single"),
  );
  console.log(
    chalk.hex("#34d399").bold("  person who follows and unfollows you."),
  );
  console.log("");
  console.log(
    chalk.hex("#c4b5fd")("  Now you have the power to know exactly who your ") +
      chalk.hex("#ff6b6b").bold("haters") +
      chalk.hex("#c4b5fd")(" are,"),
  );
  console.log(
    chalk.hex("#c4b5fd")(
      "  and I'd build this shit again in a heartbeat because",
    ),
  );
  console.log(chalk.hex("#c4b5fd")("  I've never been more at peace."));
  console.log("");
  console.log(chalk.hex("#c4b5fd")("  Cheers :D"));
  console.log(
    "  " +
      link(
        chalk.hex("#818cf8").bold("Anant"),
        "https://github.com/GithubAnant",
      ) +
      chalk.hex("#c4b5fd")(" �"),
  );
  console.log("");
}

/**
 * Display the /haters hall of shame — past unfollowers from history.
 */
async function displayHaters() {
  const { getStoredHaters } = await import("../utils/store.js");
  const haters = getStoredHaters();

  console.log("");

  if (!haters || haters.length === 0) {
    console.log(
      chalk.dim("  No haters recorded yet. Run ") +
        chalk.cyan("/check") +
        chalk.dim(" to start tracking."),
    );
    console.log("");
    return;
  }

  console.log(chalk.bold.red("  📋 THE HALL OF SHAME"));
  console.log(chalk.dim("  ─────────────────────────────────────"));
  console.log("");

  // Group by username (someone might unfollow, re-follow, then unfollow again)
  const grouped = {};
  for (const entry of haters) {
    if (!grouped[entry.login]) {
      grouped[entry.login] = [];
    }
    grouped[entry.login].push(entry.detectedAt);
  }

  for (const [login, dates] of Object.entries(grouped)) {
    const profileUrl = `https://github.com/${login}`;
    const lastDate = new Date(dates[dates.length - 1]).toLocaleDateString();
    const times =
      dates.length > 1 ? chalk.red(` (${dates.length}x repeat offender!)`) : "";
    console.log(
      `  ${chalk.red("💔")} ${link(chalk.bold(login), profileUrl)}${times}`,
    );
    console.log(
      `     ${chalk.dim("Last detected:")} ${chalk.yellow(lastDate)}`,
    );
  }

  console.log("");
  console.log(
    chalk.dim(
      `  Total haters: ${chalk.white.bold(Object.keys(grouped).length)}`,
    ),
  );
  console.log("");
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
    `  ${chalk.cyan("/haters")}             ${chalk.dim("View your hall of shame")}`,
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
    `  ${chalk.cyan("/why")}                ${chalk.dim("Why does this exist?")}`,
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

  // Track whether we're intentionally closing
  let intentionalClose = false;

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

    if (cmd === "why") {
      displayWhy();
      rl.prompt();
      return;
    }

    if (cmd === "haters") {
      await displayHaters();
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
      intentionalClose = true;
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
    rl.resume();
    rl.prompt();
  });

  rl.on("close", () => {
    if (!intentionalClose) {
      // Readline was closed by something else (e.g. @clack/prompts).
      // Don't exit — just silently let the REPL re-create itself.
      return;
    }
    console.log(chalk.dim("\n  👋 See you later!\n"));
    process.exit(0);
  });
}
