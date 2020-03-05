export default function(router) {
    router.push({
      path: "/user-management",
      name: "user-management",
      component: { render: h => h("router-view") },
      meta: { icon: "user", title: "用户管理", authority: ["admin"] },
      children: [
        {
            path: "/user-management/user",
            name: "user",
            meta: { icon: "user", title: "用户管理", authority: ["admin"] },
            component: () =>
              import(
                /* webpackChunkName: "system" */ "../../../views/userManagement/index.vue"
              )
          },
          {
            path: "/user-management/role",
            name: "role",
            meta: { icon: "user", title: "角色管理", authority: ["admin"] },
            component: () =>
              import(
                /* webpackChunkName: "system" */ "../../../views/userManagement/role.vue"
              )
          },
      ]
    });
  }
  