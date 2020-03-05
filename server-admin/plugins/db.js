//为Mongoose配置数据库信息
module.exports = app => {
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://127.0.0.1:27017/graduation-project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  require("require-all")(__dirname + "/../models");
};
