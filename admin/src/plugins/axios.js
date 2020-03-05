import axios from "axios";
import Vue from "vue";
// axios配置
axios.defaults.baseURL =
  process.env.VUE_APP_API_URL || "/admin/api/";
//未完成的请求数
let reqNum = 0;
axios.interceptors.request.use(
  config => {
    reqNum++;
    if (localStorage.token) {
      //当token存在，则对服务器发起请求时让请求头多带上一个字段Authorization
      config.headers.Authorization = "Bearer " + localStorage.token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  res => {
    reqNum--;
    const apiRes = res.data;
    return apiRes;
  },
  async err => {
    if (err.response.data.message) {
      Vue.prototype.$message.error(err.response.data.message);
    }
    return Promise.reject(err);
  }
);

export default axios;
