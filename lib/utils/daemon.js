import { spawn } from "child_process";
import Conf from "conf";
import process from "process";

const config = new Conf({ projectName: "githate-cli" });

export const getDaemonPid = () => config.get("daemonPid");
export const setDaemonPid = (pid) => config.set("daemonPid", pid);
export const clearDaemonPid = () => config.delete("daemonPid");

export const startDaemon = (intervalMinutes = 10) => {
  const existingPid = getDaemonPid();
  if (existingPid) {
    try {
      process.kill(existingPid, 0); // Check if running
      throw new Error(`Daemon is already running (PID: ${existingPid})`);
    } catch (e) {
      if (e.code === "EPERM") throw e;
      // Process not found, clear stale PID
      clearDaemonPid();
    }
  }

  const subprocess = spawn(
    process.argv[0], // node executable
    [process.argv[1], "__daemon", "--interval", intervalMinutes.toString()], // args
    {
      detached: true,
      stdio: "ignore", // vital for detachment
      env: { ...process.env, GITHATE_DAEMON: "true" },
    },
  );

  subprocess.unref(); // Allow parent to exit independently
  setDaemonPid(subprocess.pid);
  return subprocess.pid;
};

export const stopDaemon = () => {
  const pid = getDaemonPid();
  if (!pid) {
    throw new Error("No daemon is currently running.");
  }

  try {
    process.kill(pid, "SIGTERM");
    clearDaemonPid();
    return true;
  } catch (e) {
    if (e.code === "ESRCH") {
      clearDaemonPid();
      throw new Error("Daemon process not found (stale PID cleared).");
    }
    throw e;
  }
};

export const getDaemonStatus = () => {
  const pid = getDaemonPid();
  if (!pid) return { running: false };

  try {
    process.kill(pid, 0);
    return { running: true, pid };
  } catch (e) {
    return { running: false, stale: true };
  }
};
