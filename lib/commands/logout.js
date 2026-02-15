import { deleteStoredToken, deleteStoredUsername } from "../utils/store.js";
import { displaySuccess, displayIntro, displayOutro } from "../ui/display.js";

export const logout = async () => {
  deleteStoredToken();
  // Optionally clear the username too if you want a full reset,
  // but keeping it might be nice for "Guest Mode".
  // Let's keep the username so they can still check as guest easily.

  displaySuccess("Logged out successfully.");
  displayOutro("Token removed. You differ to Guest Mode limits (60 req/hr).");
};
