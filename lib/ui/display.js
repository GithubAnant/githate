import { spinner, note, log } from "@clack/prompts";
import color from "picocolors";
import boxen from "boxen";
import chalk from "chalk";
import { getBanner } from "./art.js";

// ANSI escape code for hyperlinks: \u001b]8;;<url>\u001b\<text>\u001b]8;;\u001b\
export const link = (text, url) => {
  return `\u001b]8;;${url}\u001b\\${text}\u001b]8;;\u001b\\`;
};

const TIPS = [
  "Run 'githate check' often to catch them red-handed.",
  "Use 'githate login' to authenticate securely.",
  "Don't take it personally, it's just business.",
  "Haters gonna hate, creators gonna create.",
];

const getRandomTip = () => TIPS[Math.floor(Math.random() * TIPS.length)];

export const displayIntro = () => {
  console.log(getBanner());
  // console.log(chalk.dim("Track who unfollowed you on GitHub\n")); // Removed for cleaner look matching screenshots

  console.log(chalk.bold("Tips for getting started:"));
  console.log(chalk.dim("1. Login with your GitHub PAT."));
  console.log(chalk.dim("2. Run check to see your followers."));
  console.log(chalk.dim(`3. ${getRandomTip()}\n`));

  // Removing standard clack intro to match the "clean" screenshot look
  // intro(chalk.bgHex("#2e2e2e").white(" ➜ GITHATE CLI "));
};

export const displayOutro = (message) => {
  console.log("");
  console.log(` ${chalk.green("➜")} ${chalk.bold(message)}\n`);
  // outro(chalk.bold(message));
};

export const displayError = (message) => {
  console.log(
    boxen(chalk.red.bold(message), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "red",
      title: "ERROR",
      titleAlignment: "center",
    }),
  );
};

export const displaySuccess = (message) => {
  console.log(` ${chalk.green("✔")} ${message}`);
};

export const displayInfo = (message) => {
  console.log(` ${chalk.blue("✦")} ${chalk.dim(message)}`);
};

export const displayWarning = (message) => {
  console.log(` ${chalk.yellow("!")} ${chalk.yellow(message)}`);
};

export const displayHater = (username) => {
  const profileUrl = `https://github.com/${username}`;
  console.log(
    ` ${chalk.red("💔")} ${link(chalk.red.bold(username), profileUrl)} unfollowed you!`,
  );
  console.log(`    ${chalk.dim(profileUrl)}`);
};

export const createSpinner = () => {
  return spinner();
};

export const displayHelp = () => {
  console.log(chalk.bold("\nAvailable Commands:"));
  console.log(
    `  ${chalk.cyan("githate check")}       - ${chalk.dim("Check for new unfollowers/followers")}`,
  );
  console.log(
    `  ${chalk.cyan("githate login")}       - ${chalk.dim("Login to GitHub")}`,
  );
  console.log(
    `  ${chalk.cyan("githate followers")}   - ${chalk.dim("List your followers")}`,
  );
  console.log(
    `  ${chalk.cyan("githate following")}   - ${chalk.dim("List who you are following")}`,
  );
  console.log(
    `  ${chalk.cyan("githate follow <user>")} - ${chalk.dim("Follow a user")}`,
  );
  console.log(
    `  ${chalk.cyan("githate unfollow <user>")} - ${chalk.dim("Unfollow a user")}`,
  );
  console.log("");
};
