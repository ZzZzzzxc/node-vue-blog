import Axios from "../plugins/axios";

export class baseModel {
  constructor(modelName, id, req) {
    this.modelName = modelName;
  }
  //获取列表信息
  getList(req) {
    return Axios.get("rest/" + this.modelName, { params: req });
  }
  //获取单条信息
  getById(id) {
    return Axios.get("rest/" + this.modelName + "/" + id);
  }
  //修改
  put(id, req) {
    return Axios.put("rest/" + this.modelName + "/" + id, req);
  }
  //新增
  post(req) {
    return Axios.post("rest/" + this.modelName, req);
  }
  //删除
  delete(id) {
    return Axios.delete("rest/" + this.modelName + "/" + id);
  }
  //文件上传
  upload(req) {
    return Axios.post("/upload", req);
  }
  //文件上传(七牛)
  uploadByQiniu() {
    return Axios.post("/upload/qiniu");
  }
}

export default {};
