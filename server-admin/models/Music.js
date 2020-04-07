const mongoose = require("mongoose");
//创建Schema
const schema = new mongoose.Schema(
  {
    //歌名
    title: { type: String },
    //歌手名
    singer: { type: String },
    //url
    url: { type: String },
    //歌词
    lrc: { type: String }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

//导出Model
module.exports = mongoose.model("Music", schema);
