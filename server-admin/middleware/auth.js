module.exports = options => {
  //校验及错误处理
  const assert = require("http-assert");
  //token设置及处理
  const jwt = require("jsonwebtoken");
  return async (req, res, next) => {
    //检查是否有token
    const token = String(req.headers.authorization || "")
      .split(" ")
      .pop();
    assert(token, 401, "请先登录");
    //将token解码
    const { id, role } = jwt.verify(token, req.app.get("secret"), function(
      err,
      decoded
    ) {
      if (err) {
        err = {
          message: "请先登录"
        };
        return err;
      }
      return decoded;
    });
    if (req.method === "GET") {
      assert(role && id, 401, "权限不足");
    } else {
      assert(role === "admin", 401, "权限不足");
    }
    await next();
  };
};
