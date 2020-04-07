//github第三方登录配置
module.exports = app => {
  let baseConfig = app.get("baseConfig");
  const githubConfig = {
    github_ID: "ZzZzzzxc",
    // ID
    client_ID:
      baseConfig.mode == "dev"
        ? "4d25753d7efaa9fd4110"
        : "1907cb4846ecbb2c376d",
    //密钥
    client_Secret:
      baseConfig.mode == "dev"
        ? "36ba0a658541e81f28ab551fa8516e0db159e1cb"
        : "fd3c3ddaa0e0472c2e09b8eb9bdd6d9cf8f2bfc6",
    // 获取 access_token
    access_token_url: "https://github.com/login/oauth/access_token",
    // 获取用户信息
    user_info_url: "https://api.github.com/user?",
    // 回调地址
    redirect_uri:
      baseConfig.mode == "dev"
        ? "http://localhost:8080/login"
        : "https://admin.zhangxc.cn/login"
  };
  app.set("githubConfig", githubConfig);
};
