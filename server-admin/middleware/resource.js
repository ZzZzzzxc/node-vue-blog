//admin通用接口Model名字
module.exports = options => {
    return async (req, res, next) => {
      //将url中的首字母小写复数形式的资源名转为首字母大写单数形式的模型名
      const modelName = require("inflection").classify(req.params.resource);
      req.Model = require(`../models/${modelName}`);
      next();
    };
  };
  