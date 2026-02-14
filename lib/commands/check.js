import { getOctokit } from "../utils/auth.js";
import {
  getStoredFollowers,
  setStoredFollowers,
  setLastCheck,
  getLastCheck,
  addHaters,
} from "../utils/store.js";
import {
  displayIntro,
  displaySuccess,
  displayError,
  createSpinner,
  displayInfo,
  displayWarning,
  displayOutro,
  displayHater,
  link,
} from "../ui/display.js";
import { getHaterReveal } from "../ui/art.js";
import color from "picocolors";
import chalk from "chalk";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const check = async () => {
  displayIntro();
  const s = createSpinner();
  let targetUser;

  try {
    const octokit = getOctokit();
    const { getStoredToken, getStoredUsername, setStoredUsername } =
      await import("../utils/store.js");
    const { text, isCancel, cancel } = await import("@clack/prompts");
    const chalk = (await import("chalk")).default;

    targetUser = getStoredUsername();
    const token = getStoredToken();

    // If we have a token, we can get the username from the authenticated user
    if (token && !targetUser) {
      try {
        const { data } = await octokit.rest.users.getAuthenticated();
        targetUser = data.login;
        setStoredUsername(targetUser);
      } catch (e) {
        // Token might be invalid, ignore and fall through
      }
    }

    // If still no username (Guest Mode first run), ask for it
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

    s.start(`Fetching followers for ${targetUser}...`);

    const { getFollowerState } = await import("../utils/checker.js");
    const {
      currentFollowerLogins,
      storedFollowers,
      newFollowers,
      unfollowers,
      lastCheck,
      isFirstRun,
    } = await getFollowerState(octokit, targetUser);

    s.stop("Followers fetched");

    if (isFirstRun) {
      displayInfo(
        "First run detected! Storing current followers for future checks.",
      );
      setStoredFollowers(currentFollowerLogins);
      setLastCheck(new Date().toISOString());
      displayOutro(`Tracking ${currentFollowerLogins.length} followers.`);
      return;
    }

    console.log("");
    if (lastCheck) {
      displayInfo(`Last check: ${new Date(lastCheck).toLocaleString()}`);
    }
    console.log("");

    if (newFollowers.length > 0) {
      displaySuccess(`New Followers (+${newFollowers.length}):`);
      newFollowers.forEach((login) =>
        console.log(
          ` ${color.green("+")} ${link(login, `https://github.com/${login}`)}`,
        ),
      );
      console.log("");
    } else {
      console.log(color.dim("No new followers."));
    }

    if (unfollowers.length > 0) {
      console.log("\n");
      console.log(getHaterReveal("THE HATERS"));
      console.log("\n");

      for (const login of unfollowers) {
        await sleep(500); // Dramatic pause
        displayHater(login);
      }

      console.log("");
      displayInfo(
        'Consider using "githate unfollow <username>" if you want to respond.',
      );
    } else {
      console.log(color.dim("No new unfollowers. Everyone still loves you!"));
    }

    // Update store
    if (unfollowers.length > 0) {
      addHaters(unfollowers);
    }
    setStoredFollowers(currentFollowerLogins);
    setLastCheck(new Date().toISOString());

    displayOutro("Check complete & database updated.");
  } catch (error) {
    s.stop("Check failed");
    if (error.status === 403) {
      displayError(
        "API Rate Limit Exceeded.\nGuest mode is limited to 60 req/hr.\nRun 'githate login' to increase limits.",
      );
    } else if (error.status === 404) {
      displayError(`User '${targetUser}' not found.`);
      const { deleteStoredUsername } = await import("../utils/store.js");
      deleteStoredUsername(); // Reset so it asks again next time
      console.log("Invalid username cleared. Please run 'check' again.");
    } else {
      displayError(error.message);
    }
  }
};
