import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
//初始化css
import "normalize.css/normalize.css";
import "./style/base.css";
//moment(日期格式转换)
import moment from "moment";
Vue.prototype.$moment = moment;
//axios
import axios from "./plugins/axios";
Vue.prototype.$http = axios;
//图片懒加载
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require("@/assets/jpg/error.jpg"),
  loading: require("@/assets/gif/loading.gif"),
  attempt: 3,
  lazyComponent: true
});
//全局消息组件
import Message from "./components/Message/index";
Vue.prototype.$Message = Message;
//加载中
import loading from './components/loading/index.js'
Vue.use(loading);
//气泡框
import popover from './components/popover/index.js'
Vue.use(popover);
//代码高亮
import "highlight.js/styles/atom-one-dark.css";
//svgIcon
import "./components/svgIcon/index.js";
//valine评论
window.AV = require("leancloud-storage");

const vm = new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
