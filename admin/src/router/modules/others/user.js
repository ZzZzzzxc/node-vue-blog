export default function(router) {
  router.push({
    hideInMenu: true,
    path: "/login",
    name: "login",
    meta: { authority: ["all"] },
    component: () =>
      import(/* webpackChunkName: "user" */ "../../../views/user/Login")
  });
}
