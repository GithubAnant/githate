import { authenticateWithDeviceFlow, verifyToken } from "../utils/auth.js";
import { setStoredToken } from "../utils/store.js";
import {
  displayIntro,
  displaySuccess,
  displayError,
  displayOutro,
  createSpinner,
} from "../ui/display.js";

export const login = async () => {
  displayIntro();

  try {
    const token = await authenticateWithDeviceFlow();

    const s = createSpinner();
    s.start("Verifying new token...");

    // Verify the token we just got (and get the username)
    const user = await verifyToken(token);
    setStoredToken(token);

    s.stop("Token verified!");
    displaySuccess(`Logged in as ${user.login}`);
  } catch (error) {
    displayError(error.message);
    process.exit(1);
  }

  displayOutro("You are ready to track the haters!");
};
