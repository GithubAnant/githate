import Conf from "conf";

const schema = {
  token: {
    type: "string",
  },
  username: {
    type: "string",
  },
  followers: {
    type: "array",
    default: [],
  },
  lastCheck: {
    type: "string",
  },
};

const config = new Conf({
  projectName: "githate-cli",
  schema,
});

export const getStoredToken = () => config.get("token");
export const setStoredToken = (token) => config.set("token", token);
export const deleteStoredToken = () => config.delete("token");

export const getStoredUsername = () => config.get("username");
export const setStoredUsername = (username) => config.set("username", username);
export const deleteStoredUsername = () => config.delete("username");

export const getStoredFollowers = () => config.get("followers");
export const setStoredFollowers = (followers) =>
  config.set("followers", followers);

export const setLastCheck = (date) => config.set("lastCheck", date);
export const getLastCheck = () => config.get("lastCheck");

export const clearStore = () => config.clear();
