import axios from "axios";
// axios配置
axios.defaults.baseURL = process.env.VUE_APP_API_URL || "/web/api/rest/";
//未完成的请求数
let reqNum = 0;
axios.interceptors.request.use(
  config => {
    reqNum++;
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  res => {
    reqNum--;
    const apiRes = res.data;
    return apiRes;
  },
  async error => {
    console.dir(error);
    return Promise.reject(error);
  }
);

export default axios;
