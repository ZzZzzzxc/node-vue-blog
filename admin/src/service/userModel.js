import Axios from "../plugins/axios";

export class UserModel {
  constructor() {}
  /**
   * GitHub登录
   * @param req.code GitHub登录成功后获得的code
   */
  loginByGithub(req) {
    return Axios.get("/github/login", { params: req });
  }
  //获取用户权限信息
  getUserRole() {
    return Axios.get("/user");
  }
  /**
   * 获取Github用户信息
   * @param id Github的用户id
   */
  getUserInfoByGithub(id) {
    return Axios.get(`/getUserInfo/github/${id}`);
  }
  //游客登录
  loginByGuest() {
    return Axios.get("/guest/login");
  }
  /**
   * 本站账户登录
   * @param  req.username 用户名
   * @param  req.password 密码
   */
  loginByNoumenon(req) {
    return Axios.post("/noumenon/login", req);
  }
  //获取本站用户信息
  getUserInfoByNoumenon() {
    return Axios.get(`/getUserInfo/noumenon`);
  }
}

export default {};
