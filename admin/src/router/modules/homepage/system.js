export default function(router) {
  router.push({
    path: "/system",
    name: "system",
    component: { render: h => h("router-view") },
    meta: { icon: "setting", title: "系统管理", authority: ["guest", "admin"] },
    children: [
      {
        path: "/system/dictionary",
        name: "dictionary",
        meta: { icon: "file", title: "系统字典", authority: ["bigadmin"] },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/dictionary/index.vue"
          )
      },
      {
        path: "/system/history",
        name: "history",
        meta: { icon: "message", title: "历史记录", authority: ["admin"] },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/history/index.vue"
          )
      },

      {
        path: "/system/recoverBox",
        name: "recoverBox",
        meta: { icon: "delete", title: "回收站", authority: ["admin"] },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/recoverBox/index.vue"
          )
      },
      {
        path: "/system/draftBox",
        name: "draftBox",
        meta: { icon: "diff", title: "草稿箱", authority: ["admin"] },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/draftBox/index.vue"
          )
      },
      {
        path: "/system/nav",
        name: "nav",
        meta: {
          icon: "user",
          title: "导航栏管理",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/nav/index.vue"
          )
      },
      {
        path: "/system/file",
        name: "file",
        meta: {
          icon: "file",
          title: "文件管理",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/fileManage/index.vue"
          )
      },
      {
        path: "/system/logo",
        name: "logo",
        meta: {
          icon: "file",
          title: "Logo管理",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/logo/index.vue"
          )
      },
      {
        path: "/system/about",
        name: "about",
        meta: { icon: "user", title: "关于我", authority: ["guest", "admin"] },
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../../../views/systemManagement/aboutMe/index.vue"
          )
      }
    ]
  });
}
