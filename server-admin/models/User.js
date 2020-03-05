const mongoose = require("mongoose");
//创建Schema
const schema = new mongoose.Schema(
  {
    //权限
    roles: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Role" }],
    //名称
    name: { type: String },
    //账号
    account: { type: String },
    //密码
    password: {
      type: String,
      select: false,
      set(val) {
        return require("bcryptjs").hashSync(val, 10);
      }
    }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

//导出Model
module.exports = mongoose.model("User", schema);
