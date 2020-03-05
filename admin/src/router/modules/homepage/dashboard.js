export default function(router){
  router.push({
    path: "/dashboard",
    name: "dashboard",
    meta: { icon: "dashboard", title: "仪表盘", authority: ["bigadmin"] },
    component: { render: h => h("router-view") },
    children: [
      {
        path: "/dashboard/dashboard1",
        name: "dashboard1",
        meta: { title: "dashboard1", authority: ["bigadmin"] },
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../../../views/dashboard/dashboard1"
          )
      }
    ]
  })
}
