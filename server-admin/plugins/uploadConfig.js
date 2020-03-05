//文件上传设置
module.exports = app => {
  let baseConfig = app.get("baseConfig");
  const uploadConfig = {
    filePath:
      baseConfig.mode == "dev"
        ? "http://localhost:3002/uploads/"
        : "https://xxxx.com/uploads/",
    mimetype: {
      "image/png": "png",
      "image/jpeg": "jpg",
      "audio/mp3": "mp3"
    }
  };
  app.set("uploadConfig", uploadConfig);
};
