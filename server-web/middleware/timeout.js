//请求超时中间件
module.exports = options => {
  return async (req, res, next) => {
    res.setTimeout(120 * 1000, function() {
      return res.status(408).send(
        JSON.stringify({
          msg: "请求超时",
          status: 103
        })
      );
    });
    next();
  };
};
