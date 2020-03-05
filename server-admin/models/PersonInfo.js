const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    //标题
    title: { type: String },
    //头像
    avatar: { type: String },
    //名称
    name: { type: String },
    //基本信息
    baseInfo: { type: String }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = mongoose.model("PersonInfo", schema);
