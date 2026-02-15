import { getOctokit } from "../utils/auth.js";
import {
  displayIntro,
  displayOutro,
  createSpinner,
  displayError,
  link,
} from "../ui/display.js";
import color from "picocolors";

export const following = async () => {
  const s = createSpinner();

  try {
    const octokit = getOctokit();
    s.start("Fetching following list...");

    const followingList = await octokit.paginate(
      octokit.rest.users.listFollowedByAuthenticated,
      {
        per_page: 100,
      },
    );

    s.stop(`You are following ${followingList.length} users`);

    if (followingList.length === 0) {
      displayOutro("You are not following anyone.");
      return;
    }

    console.log(""); // New line
    followingList.forEach((user) => {
      console.log(`${color.blue("•")} ${link(user.login, user.html_url)}`);
    });
    console.log("");

    displayOutro("End of following list");
  } catch (error) {
    s.stop("Failed to fetch following list");
    displayError(error.message);
  }
};
