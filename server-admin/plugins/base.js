//github第三方登录配置
module.exports = app => {
  const baseConfig = {
    // mode: "production",
    mode: "dev",
    host: 3002
  };
  app.set("baseConfig", baseConfig);
};
