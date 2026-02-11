import { getOctokit } from "../utils/auth.js";
import {
  displayIntro,
  displaySuccess,
  displayError,
  createSpinner,
} from "../ui/display.js";

export const follow = async (username) => {
  displayIntro();
  const s = createSpinner();

  try {
    const octokit = getOctokit();
    s.start(`Following ${username}...`);

    await octokit.rest.users.follow({
      username,
    });

    s.stop(`Followed ${username}`);
    displaySuccess(`Successfully followed ${username}`);
  } catch (error) {
    s.stop(`Failed to follow ${username}`);
    displayError(error.message);
  }
};
