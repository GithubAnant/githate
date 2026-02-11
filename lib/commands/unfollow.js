import { getOctokit } from "../utils/auth.js";
import {
  displayIntro,
  displaySuccess,
  displayError,
  createSpinner,
} from "../ui/display.js";

export const unfollow = async (username) => {
  displayIntro();
  const s = createSpinner();

  try {
    const octokit = getOctokit();
    s.start(`Unfollowing ${username}...`);

    await octokit.rest.users.unfollow({
      username,
    });

    s.stop(`Unfollowed ${username}`);
    displaySuccess(`Successfully unfollowed ${username}`);
  } catch (error) {
    s.stop(`Failed to unfollow ${username}`);
    displayError(error.message);
  }
};
