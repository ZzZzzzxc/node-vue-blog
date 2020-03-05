//github第三方登录配置
module.exports = app => {
    const roleConfig = ['admin','guest'];
    app.set("roleConfig", roleConfig);
  };
  