const mongoose = require("mongoose");
//创建Schema
const schema = new mongoose.Schema(
  {
    encoding: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
    filename: { type: String },
    url: { type: String },
    path: { type: String },
    size: { type: String },
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

//导出Model
module.exports = mongoose.model("Album", schema);
