import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import moment from "moment";
Vue.prototype.$moment = moment;

const echarts = require("echarts");
Vue.prototype.$echarts = echarts;

import "normalize.css/normalize.css";

import "./icons/index";

import "./style/main.css";

import {
  Button,
  Layout,
  Menu,
  Icon,
  Drawer,
  Radio,
  Form,
  Input,
  Table,
  Tag,
  Divider,
  Row,
  Col,
  Modal,
  Popconfirm,
  Message,
  Notification,
  Select,
  Tooltip,
  BackTop,
  Collapse,
  List,
  Timeline,
  Upload,
  Spin,
  Avatar,
  Card,
  Skeleton,
  Tabs,
  Progress
} from "ant-design-vue";
Vue.use(Button);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Form);
Vue.use(Input);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Divider);
Vue.use(Row);
Vue.use(Col);
Vue.use(Modal);
Vue.use(Popconfirm);
Vue.use(Select);
Vue.use(Tooltip);
Vue.use(BackTop);
Vue.use(Collapse);
Vue.use(List);
Vue.use(Timeline);
Vue.use(Upload);
Vue.use(Spin);
Vue.use(Avatar);
Vue.use(Card);
Vue.use(Skeleton);
Vue.use(Tabs);
Vue.use(Progress);
Vue.prototype.$message = Message;
Vue.prototype.$notification = Notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$destroyAll = Modal.destroyAll;
//axios
import axios from "./plugins/axios";
Vue.prototype.$http = axios;
//markdown
// import mavonEditor from "mavon-editor";
// import "mavon-editor/dist/css/index.css";
// Vue.use(mavonEditor);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
