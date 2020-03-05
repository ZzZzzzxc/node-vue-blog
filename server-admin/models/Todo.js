const mongoose = require("mongoose");
//创建Schema
const schema = new mongoose.Schema(
  {
    //名称
    title: { type: String },
    //备注
    info: { type: String }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

//导出Model
module.exports = mongoose.model("Todo", schema);
