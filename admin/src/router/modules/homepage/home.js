export default function(router) {
  router.push({
    path: "/home",
    name: "home",
    meta: { icon: "home", title: "Home", authority: ["guest", "admin"] },
    component: { render: h => h("router-view") },
    children: [
      {
        path: "/home/page",
        name: "homePage",
        meta: { icon: "home", title: "首页", authority: ["guest", "admin"] },
        component: () =>
          import(/* webpackChunkName: "home" */ "../../../views/home/home")
      },
      {
        path: "/home/todo",
        name: "todoList",
        meta: {
          icon: "snippets",
          title: "Todo",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(/* webpackChunkName: "home" */ "../../../views/home/todo")
      }
    ]
  });
}
