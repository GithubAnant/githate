import { getOctokit } from "../utils/auth.js";
import {
  getStoredUsername,
  setStoredUsername,
  setStoredFollowers,
  setLastCheck,
} from "../utils/store.js";
import { getFollowerState } from "../utils/checker.js";
import { sendNotification } from "../utils/notify.js";
import {
  displayIntro,
  displayInfo,
  displaySuccess,
  displayError,
  displayHater,
} from "../ui/display.js";
import { getHaterReveal } from "../ui/art.js";
import color from "picocolors";
import chalk from "chalk"; // Import chalk for styling

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const watch = async (intervalMinutes = 10) => {
  displayIntro();

  let targetUser;

  try {
    const octokit = getOctokit();
    const { text, isCancel, cancel } = await import("@clack/prompts");

    targetUser = getStoredUsername();

    // Auth check similar to check.js
    const { getStoredToken } = await import("../utils/store.js");
    const token = getStoredToken();
    if (token && !targetUser) {
      try {
        const { data } = await octokit.rest.users.getAuthenticated();
        targetUser = data.login;
        setStoredUsername(targetUser);
      } catch (e) {}
    }

    if (!targetUser) {
      const username = await text({
        message: "Enter your GitHub username to track:",
        placeholder: "",
        validate: (value) => {
          if (!value) return "Username is required!";
        },
      });

      if (isCancel(username)) {
        cancel("Operation cancelled.");
        return;
      }
      targetUser = username;
      setStoredUsername(targetUser);
    }

    console.log(
      chalk.cyan(`\n👀 Watching ${chalk.bold(targetUser)} for changes...`),
    );
    console.log(chalk.dim(`   Polling every ${intervalMinutes} minutes.`));
    console.log(
      chalk.dim(`   Keep this terminal open to receive notifications.\n`),
    );

    const checkLoop = async () => {
      try {
        const timestamp = new Date().toLocaleTimeString();
        process.stdout.write(chalk.dim(`[${timestamp}] Checking... `));

        const { currentFollowerLogins, newFollowers, unfollowers, isFirstRun } =
          await getFollowerState(octokit, targetUser);

        if (isFirstRun) {
          process.stdout.write(chalk.green("First run. Initialized.\n"));
          setStoredFollowers(currentFollowerLogins);
          setLastCheck(new Date().toISOString());
        } else if (newFollowers.length > 0 || unfollowers.length > 0) {
          process.stdout.write(chalk.bold("Changes detected!\n"));

          if (newFollowers.length > 0) {
            const msg = `You gained ${newFollowers.length} new follower(s)!`;
            console.log(chalk.green(`   + ${newFollowers.join(", ")}`));
            sendNotification("New Follower! 🎉", msg);
          }

          if (unfollowers.length > 0) {
            const msg = `${unfollowers.length} person(s) unfollowed you.`;
            console.log(chalk.red(`   - ${unfollowers.join(", ")}`));
            sendNotification("Hater Alert! 💔", msg);
          }

          setStoredFollowers(currentFollowerLogins);
          setLastCheck(new Date().toISOString());
        } else {
          process.stdout.write(chalk.dim("No changes.\n"));
        }
      } catch (error) {
        process.stdout.write(chalk.red("Error.\n"));
        console.error(chalk.red(`   ${error.message}`));
      }
    };

    // Initial check
    await checkLoop();

    // Loop
    while (true) {
      await sleep(intervalMinutes * 60 * 1000);
      await checkLoop();
    }
  } catch (error) {
    displayError(error.message);
  }
};
