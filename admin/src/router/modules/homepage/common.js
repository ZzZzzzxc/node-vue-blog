export default function(router) {
  router.push({
    path: "/common",
    name: "common",
    component: { render: h => h("router-view") },
    meta: { icon: "form", title: "内容管理", authority: ["guest", "admin"] },
    children: [
      {
        path: "/tag/list",
        name: "tagList",
        meta: {
          icon: "database",
          title: "标签管理",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(
            /* webpackChunkName: "common" */ "../../../views/articleManagement/tag/list.vue"
          )
      },
      {
        path: "/article/create",
        name: "articleCreate",
        meta: {
          icon: "form",
          title: "新建文章",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(
            /* webpackChunkName: "common" */ "../../../views/articleManagement/article/edit.vue"
          )
      },
      {
        path: "/article/list",
        name: "articleList",
        meta: {
          icon: "table",
          title: "文章列表",
          authority: ["guest", "admin"]
        },
        component: () =>
          import(
            /* webpackChunkName: "common" */ "../../../views/articleManagement/article/list.vue"
          )
      },
      {
        path: "/article/edit/:id",
        name: "articleEdit",
        hideInMenu: true,
        meta: {
          icon: "table",
          title: "articleEdit",
          authority: ["guest", "admin"]
        },
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "common" */ "../../../views/articleManagement/article/edit.vue"
          )
      }
    ]
  });
}
