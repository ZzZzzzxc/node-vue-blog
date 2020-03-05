import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import { homePageRouter, othersRouter } from "./modules/index";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { removeUserMessage } from "../utils/auth";

import { UserModel } from "../service/userModel";
const userModel = new UserModel();

Vue.use(VueRouter);

const routes = [];

const publicRouter = {
  path: "/public",
  meta: { authority: ["all"] },
  children: [],
  redirect: "/login",
  component: { render: h => h("router-view") }
};

const rootRouter = {
  path: "/",
  redirect: "/home/page",
  meta: { authority: ["guest", "admin"] },
  children: [],
  component: () =>
    import(/* webpackChunkName: "layout" */ "../layouts/FormBasicLayout")
};

const redirectRouter = {
  path: "*",
  meta: { authority: ["guest", "admin"] },
  redirect: "/home/page"
};

homePageRouter.forEach(route => route(rootRouter.children));
othersRouter.forEach(route => route(publicRouter.children));

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes.concat([publicRouter, rootRouter, redirectRouter])
});

router.beforeEach((to, from, next) => {
  // 获取路由权限信息
  const records = to.meta.authority ? to.meta.authority : [];
  // 如果页面不可以公开访问且没有token
  if (!records.includes("all") && !localStorage.token) {
    console.log("页面不可以公开访问且没有token");
    //登出
    removeUserMessage(next, "/login");
  }
  // 如果vuex中还未获取到用户权限
  if (!Object.keys(store.getters.getUser).length) {
    // 获取用户权限
    userModel
      .getUserRole()
      .then(res => {
        // 如果成功获取用户权限
        if (res.role) {
          // vuex存储
          store.dispatch("handleSetUser", res);
          NProgress.start();
          next();
        } else {
          console.log("未能成功获取用户权限");
          //登出
          removeUserMessage(next);
        }
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    //如果vuex中已经存储了用户权限
    const user = store.getters.getUser;
    // 如果权限允许
    if (records.includes("all") || records.includes(user.role)) {
      NProgress.start();
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
