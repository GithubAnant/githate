import { getStoredFollowers, getLastCheck } from "./store.js";

export const getFollowerState = async (octokit, targetUser) => {
  const currentFollowers = await octokit.paginate(
    octokit.rest.users.listFollowersForUser,
    {
      username: targetUser,
      per_page: 100,
    },
  );
  const currentFollowerLogins = currentFollowers.map((f) => f.login);
  const storedFollowers = getStoredFollowers();
  const lastCheck = getLastCheck();

  const isFirstRun = storedFollowers.length === 0;

  const newFollowers = currentFollowerLogins.filter(
    (login) => !storedFollowers.includes(login),
  );

  const unfollowers = storedFollowers.filter(
    (login) => !currentFollowerLogins.includes(login),
  );

  return {
    currentFollowerLogins,
    storedFollowers,
    newFollowers,
    unfollowers,
    lastCheck,
    isFirstRun,
  };
};
