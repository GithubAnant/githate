import { startDaemon, stopDaemon, getDaemonStatus } from "../utils/daemon.js";
import {
  displaySuccess,
  displayError,
  displayInfo,
  displayWarning,
} from "../ui/display.js";
import chalk from "chalk";

export const start = async (interval) => {
  try {
    const pid = startDaemon(interval);
    displaySuccess(`Background service started! (PID: ${pid})`);
    displayInfo(`Polling every ${interval} minutes.`);
    displayInfo("Run 'githate stop' to stop the service.");
  } catch (error) {
    displayError(error.message);
  }
};

export const stop = async () => {
  try {
    stopDaemon();
    displaySuccess("Background service stopped.");
  } catch (error) {
    displayWarning(error.message);
  }
};

export const status = async () => {
  const { running, pid, stale } = getDaemonStatus();
  if (running) {
    console.log(
      ` ${chalk.green("●")} Service is running (PID: ${chalk.bold(pid)})`,
    );
  } else if (stale) {
    displayWarning("Service is not running (stale PID file cleaned up).");
  } else {
    console.log(` ${chalk.dim("○")} Service is not running.`);
  }
};
