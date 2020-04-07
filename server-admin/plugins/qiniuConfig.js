module.exports = app => {
  const qiniuConfig = {
    accessKey: "DkyGk1V0MT92ziMg7RsPECEhhKcdcYmjAWMh5Wc7",
    secretKey: "wAXNcP9cYO1qdJy60VG7CCaOwI6HCcM-dQw2RUPA",
    domains: ["cdn.zhangxc.cn"],
    bucket:"cdn.zhangxc.cn"
  };
  app.set("qiniuConfig", qiniuConfig);
};
