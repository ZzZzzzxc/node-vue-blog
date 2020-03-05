module.exports = app => {
  const qiniuConfig = {
    accessKey: "your accessKey",
    secretKey: "your secretKey",
    options: {
      scope: "your scope",
      // expires: 7200,
      returnBody: `{
        "key":"$(key)",
        "hash":"$(etag)",
        "fsize":$(fsize),
        "bucket":"$(bucket)",
        "name":"$(x:name)",
        "url":"http://xxx.com/$(key)"
      }`
    }
  };
  app.set("qiniuConfig", qiniuConfig);
};
