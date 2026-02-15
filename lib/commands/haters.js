import chalk from "chalk";
import { link } from "../ui/display.js";
import { getHaterReveal } from "../ui/art.js";

/**
 * Display the /haters hall of shame — past unfollowers from history.
 */
export async function displayHaters() {
  const { getStoredHaters } = await import("../utils/store.js");
  const haters = getStoredHaters();

  console.log("");

  if (!haters || haters.length === 0) {
    console.log(chalk.white("  No haters yet. You're too cool"));
    console.log("");
    return;
  }

  console.log("");
  console.log(getHaterReveal("HATERS"));
  console.log("");

  // Group by username (someone might unfollow, re-follow, then unfollow again)
  const grouped = {};
  for (const entry of haters) {
    if (!grouped[entry.login]) {
      grouped[entry.login] = [];
    }
    grouped[entry.login].push(entry.detectedAt);
  }

  for (const [login, dates] of Object.entries(grouped)) {
    const profileUrl = `https://github.com/${login}`;
    const lastDate = new Date(dates[dates.length - 1]).toLocaleDateString();
    const times =
      dates.length > 1
        ? chalk.hex("#ff6b6b")(` (${dates.length}x repeat offender!)`)
        : "";
    console.log(
      `  ${chalk.hex("#ff6b6b")("✕")} ${link(chalk.white.bold(login), profileUrl)}${times}`,
    );
    console.log(`    ${chalk.dim("Detected:")} ${chalk.white(lastDate)}`);
    console.log("");
  }

  console.log(
    chalk.dim(
      `  Total: ${chalk.white.bold(Object.keys(grouped).length)} hater${Object.keys(grouped).length > 1 ? "s" : ""}`,
    ),
  );
  console.log("");
}
