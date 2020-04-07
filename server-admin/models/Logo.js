const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    //图片
    banner: { type: String },
    //标题
    title: { type: String },
    //是否使用图片
    isUse:{type:Number}
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = mongoose.model("Logo", schema);
