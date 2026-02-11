import { Octokit } from "@octokit/rest";
import { getStoredToken } from "./store.js";
import { displayError } from "../ui/display.js";

let octokitInstance = null;

export const getOctokit = () => {
  if (octokitInstance) return octokitInstance;

  const token = getStoredToken();
  // Valid token? Authenticated. No token? Guest mode.
  octokitInstance = new Octokit({ auth: token });
  return octokitInstance;
};

export const verifyToken = async (token) => {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  } catch (error) {
    throw new Error("Invalid token or network error.");
  }
};
