export default function(router) {
  router.push({
    path: "/music",
    name: "music",
    component: { render: h => h("router-view") },
    meta: { icon: "cloud-upload", title: "音乐管理", authority: ["guest","admin"] },
    children: [
      {
        path: "/music/list",
        name: "musicList",
        meta: {
          icon: "cloud-download",
          title: "音乐列表",
          authority: ["guest","admin"]
        },
        component: () =>
          import(
            /* webpackChunkName: "music" */ "../../../views/musicManagement/list.vue"
          )
      }
    ]
  });
}
