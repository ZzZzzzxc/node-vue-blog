import Axios from "../plugins/axios";

export class qiniuModel {
  constructor() {}
  /**
   * 获取七牛云存储桶下文件的对应的文件列表
   * @param  type 'audio，image等'
   */
  getQiniuFileList(type) {
    return Axios.get(`/qiniu/bucket/list/${type}`);
  }
  /**
   * 获取七牛云存储桶下文件的文件详情
   * @param  key 文件名
   */
  getQiniuFileDetail(key) {
    return Axios.get(`/qiniu/statistic/count/${key}`);
  }
  /**
   * 获取七牛云CDN流量详情
   * @param  req.startDate '2017-06-22'
   * @param  req.endDate '2017-06-22'
   */
  getQiniuDomainFlow(req) {
    return Axios.get(`/qiniu/domain/flow`, { params: req });
  }
  /**
   * 获取七牛云CDN带宽详情
   * @param  req.startDate '2017-06-22'
   * @param  req.endDate '2017-06-22'
   */
  getQiniuDomainBandwidth(req) {
    return Axios.get(`/qiniu/domain/bandwidth`, { params: req });
  }
}

export default {};
