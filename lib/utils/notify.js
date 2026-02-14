import notifier from "node-notifier";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const sendNotification = (title, message) => {
  notifier.notify({
    title: title,
    message: message,
    sound: true, // Only Notification Center or Windows Toasters
    wait: false, // Wait with callback, until user action is taken against notification
    // icon: join(__dirname, '../../assets/icon.png'), // Absolute path (not supported on balloon)
    // contentImage: void 0, // String | undefined
    // open: void 0, // String | undefined
  });
};
