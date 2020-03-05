const mongoose = require("mongoose");
//创建Schema
const schema = new mongoose.Schema(
  {
    //图片
    banner: { type: String },
    //标题
    title: { type: String },
    //文章描述
    description: { type: String },
    //内容（markdown）
    context: { type: String },
    //内容（html）
    contextHtml: { type: String },
    //是否展示
    isShow: { type: Boolean },
    //目录·
    catalog: { type: Array }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

//导出Model
module.exports = mongoose.model("AboutMe", schema);
