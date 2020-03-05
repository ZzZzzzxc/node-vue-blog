import system from "./homepage/system";
import dashboard from "./homepage/dashboard";
import common from "./homepage/common";
import home from "./homepage/home";
import friend from "./homepage/friend";
import music from "./homepage/music";
import user from "./others/user";
import userManagement from "./homepage/user";

export const homePageRouter = [
  home,
  common,
  dashboard,
  friend,
  music,
  system,
  userManagement
];

export const othersRouter = [user];
