const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    //关联标签
    tags: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Tag" }],
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
    //文章访问次数
    nums: { type: Number },
    //是否原创
    isOriginal: { type: Boolean },
    //目录·
    catalog: { type: Array }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = mongoose.model("Article", schema);
