import { Octokit } from "@octokit/rest";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { getStoredToken } from "./store.js";
import { displayError, displayInfo, displaySuccess } from "../ui/display.js";
import clipboard from "clipboardy";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Ov23liyj3Hj0HTe76fD9"; // Fallback or Env

let octokitInstance = null;

export const getOctokit = () => {
  if (octokitInstance) return octokitInstance;

  const token = getStoredToken();
  // Valid token? Authenticated. No token? Guest mode.
  octokitInstance = new Octokit({ auth: token });
  return octokitInstance;
};

export const authenticateWithDeviceFlow = async () => {
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: CLIENT_ID,
    scopes: ["read:user", "user:follow"],
    onVerification: (verification) => {
      displayInfo("Open the following URL in your browser:");
      console.log(`\n    ${verification.verification_uri}\n`);
      displayInfo("And enter the following code:");
      console.log(`\n    ${verification.user_code}\n`);

      try {
        clipboard.writeSync(verification.user_code);
        displaySuccess("Code copied to clipboard!");
      } catch (e) {
        // Ignore clipboard errors
      }
    },
  });

  const { token } = await auth({
    type: "oauth",
  });

  return token;
};

// Kept for backward compatibility if needed, but not used in new flow
export const verifyToken = async (token) => {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  } catch (error) {
    throw new Error("Invalid token or network error.");
  }
};
