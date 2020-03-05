//github第三方登录配置
module.exports = app => {
  let baseConfig = app.get("baseConfig");
  const githubConfig = {
    github_ID: "your id",
    // ID
    client_ID:
      baseConfig.mode == "dev"
        ? "xxxx"
        : "xxxx",
    //密钥
    client_Secret:
      baseConfig.mode == "dev"
        ? "xxxx"
        : "xxxx",
    // 获取 access_token
    access_token_url: "https://github.com/login/oauth/access_token",
    // 获取用户信息
    user_info_url: "https://api.github.com/user?",
    // 回调地址
    redirect_uri:
      baseConfig.mode == "dev"
        ? "http://localhost:8080/login"
        : "https://xxxx.com/login"
  };
  app.set("githubConfig", githubConfig);
};
