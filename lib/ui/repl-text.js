import chalk from "chalk";
import { link } from "./display.js";
import { getBanner } from "./art.js";

/**
 * Display the /why origin story.
 */
export function displayWhy() {
  console.log("");
  console.log(chalk.hex("#ff6b6b").bold("  WHY DOES THIS EXIST?"));
  console.log("");
  console.log(
    chalk.white("  Okay, true story — I opened my GitHub at like ") +
      chalk.white.bold("1am") +
      chalk.white(" a week ago"),
  );
  console.log(chalk.white("  and noticed my follower count dropped."));
  console.log("");
  console.log(
    chalk.white("  Someone unfollowed. ") + chalk.hex("#ff6b6b").bold("(WHY)"),
  );
  console.log("");
  console.log(chalk.white("  And the absolute worst part is I genuinely"));
  console.log(
    chalk.white("  could not figure out ") + chalk.white.bold("who it was."),
  );
  console.log("");
  console.log(
    chalk.white("  So I did what any ") +
      chalk.red.bold("completely normal and mentally stable") +
      chalk.white(" developer"),
  );
  console.log(chalk.white("  would do when faced with this cosmic injustice:"));
  console.log("");
  console.log(
    chalk
      .hex("#34d399")
      .bold("  I built an open-source CLI tool to track every single"),
  );
  console.log(
    chalk.hex("#34d399").bold("  person unfollows you (i.e. haters)."),
  );
  console.log("");
  console.log(chalk.white("  Honestly I've never been more at peace."));
  console.log("");
  console.log(chalk.white("  Cheers :D"));
  console.log(
    "  " + link(chalk.white.bold("Anant"), "https://github.com/GithubAnant"),
  );
  console.log("");
}

/**
 * Display REPL help — all available slash commands.
 */
export function displayREPLHelp() {
  console.log("");
  console.log(chalk.bold("  Available Commands:"));
  console.log("");
  console.log(
    `  ${chalk.cyan("/scan")}               ${chalk.dim("Check for new unfollowers")}`,
  );
  console.log(
    `  ${chalk.cyan("/haters")}             ${chalk.dim("View past unfollowers (hall of shame)")}`,
  );
  console.log(
    `  ${chalk.cyan("/followers")}          ${chalk.dim("List your followers")}`,
  );
  console.log(
    `  ${chalk.cyan("/following")}          ${chalk.dim("List who you are following")}`,
  );
  console.log(
    `  ${chalk.cyan("/login")}              ${chalk.dim("Login to GitHub")}`,
  );
  console.log(`  ${chalk.cyan("/logout")}             ${chalk.dim("Logout")}`);
  console.log(
    `  ${chalk.cyan("/start")}              ${chalk.dim("Start auto tracking")}`,
  );
  console.log(
    `  ${chalk.cyan("/stop")}               ${chalk.dim("Stop auto tracking")}`,
  );
  console.log(
    `  ${chalk.cyan("/status")}             ${chalk.dim("Check auto tracking status")}`,
  );
  console.log(
    `  ${chalk.cyan("/why")}                ${chalk.dim("Why does this exist?")}`,
  );
  console.log(
    `  ${chalk.cyan("/repo")}               ${chalk.dim("View the OSS repository")}`,
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
export function displayREPLWelcome() {
  console.clear();
  console.log(getBanner());
  console.log("");
  console.log(chalk.bold("  🎃 Getting Started:"));
  console.log("");
  console.log(
    chalk.dim("  1. ") +
      chalk.cyan("/scan") +
      chalk.dim("    - check for new haters immediately"),
  );
  console.log(
    chalk.dim("  2. ") +
      chalk.cyan("/haters") +
      chalk.dim("  - view your hall of shame"),
  );
  console.log(
    chalk.dim("  3. ") +
      chalk.cyan("/login") +
      chalk.dim("   - authenticate to avoid rate limits"),
  );
  console.log(
    chalk.dim("  4. ") +
      chalk.cyan("/start") +
      chalk.dim("   - enable background auto-tracking"),
  );
  console.log(
    chalk.dim("  5. ") +
      chalk.cyan("/help") +
      chalk.dim("    - show all available commands"),
  );
  console.log("");
}
