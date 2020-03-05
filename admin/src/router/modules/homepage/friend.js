export default function(router) {
  router.push({
    path: "/friend",
    name: "friendLink",
    meta: {
      icon: "snippets",
      title: "友链管理",
      authority: ["guest", "admin"]
    },
    component: { render: h => h("router-view") },
    children: [
      {
        path: "/friend/list",
        name: "frientList",
        meta: {
          icon: "user",
          title: "友链信息",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(/* webpackChunkName: "friend" */ "../../../views/friendLink/list")
      }
    ]
  });
}
