import Vue from "vue";
import VueRouter from "vue-router";
import BasicLayout from "../layouts/basicLayouts.vue";
import homePageRouter from "./modules/homepage";
import othersRouter from "./modules/others";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

const routes = [];

const rootRouter = {
  path: "/",
  component: BasicLayout,
  children: [],
  redirect: "/home"
};

const redirectRouter = {
  path: "*",
  redirect: "/error"
};

othersRouter(rootRouter.children);
homePageRouter(rootRouter.children);

const scrollBehavior = function(to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    };
  }
};
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes.concat([rootRouter,redirectRouter]),
  scrollBehavior
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
