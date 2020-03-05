const mongoose = require("mongoose");
//创建Schema
const schema = new mongoose.Schema(
  {
    title: { type: String },
    avatar: { type: String },
    description: { type: String },
    url: { type: String },
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

//导出Model
module.exports = mongoose.model("FriendLink", schema);
