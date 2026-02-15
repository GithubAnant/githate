import { getOctokit } from "../utils/auth.js";
import {
  displayIntro,
  displayOutro,
  createSpinner,
  displayError,
  link,
} from "../ui/display.js";
import color from "picocolors";

export const followers = async () => {
  const s = createSpinner();

  try {
    const octokit = getOctokit();
    s.start("Fetching followers...");

    const followersList = await octokit.paginate(
      octokit.rest.users.listFollowersForAuthenticatedUser,
      {
        per_page: 100,
      },
    );

    s.stop(`Found ${followersList.length} followers`);

    if (followersList.length === 0) {
      displayOutro("You have no followers yet.");
      return;
    }

    console.log(""); // New line
    followersList.forEach((follower) => {
      console.log(
        `${color.green("•")} ${link(follower.login, follower.html_url)}`,
      );
    });
    console.log("");

    displayOutro("End of followers list");
  } catch (error) {
    s.stop("Failed to fetch followers");
    if (error.status === 401 || error.status === 403) {
      displayError("You need to sign-in. Run /login first.");
    } else {
      displayError(error.message);
    }
  }
};
