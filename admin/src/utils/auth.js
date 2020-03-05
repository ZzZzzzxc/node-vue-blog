import store from "../store";

export function checkUserRole() {}

export function removeUserMessage(redirect = () => {}, route) {
  localStorage.removeItem("token");
  localStorage.removeItem("login_way");
  store.dispatch("handleSetUser", {});
  store.dispatch("handleSetuserInfo", {});
  route ? redirect(route) : redirect();
}
