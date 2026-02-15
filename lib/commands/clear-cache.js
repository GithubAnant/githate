import { clearStore } from "../utils/store.js";
import { displaySuccess, displayWarning, displayIntro } from "../ui/display.js";

export const clearCache = async () => {
  displayIntro();

  const { confirm, isCancel } = await import("@clack/prompts");

  const shouldClear = await confirm({
    message:
      "Are you sure you want to clear ALL cached data? (Token, username, followers, haters)",
    initialValue: false,
  });

  if (isCancel(shouldClear) || !shouldClear) {
    console.log("");
    displayWarning("Operation cancelled.");
    return;
  }

  clearStore();

  console.log("");
  displaySuccess("Cache cleared successfully.");
  console.log("  You will need to login again to avoid rate limits.");
  console.log("");
};
