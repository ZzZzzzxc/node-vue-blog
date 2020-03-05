// 创建一个express应用程序
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const history = require("connect-history-api-fallback");
app.use(express.json());
//CORS跨域的中间件
app.use(cors());
//gzip
app.use(compression());
//vue 路由
app.use(history());
//静态资源托管
app.use("/", express.static(__dirname + "/public/dist"));
app.use("/uploads", express.static(__dirname + "/uploads"));
//设置一个密钥
app.set("secret", "i2u34y12oi3u4y8");
//将实例app注入模块内
require("./plugins/base")(app);
require("./plugins/uploadConfig")(app);
require("./plugins/db")(app);
require("./plugins/qiniuConfig")(app);
require("./plugins/githubLogin")(app);
require("./plugins/roleConfig")(app);
require("./routes/admin")(app);
require("./routes/service")(app);

const baseConfig = app.get("baseConfig");
app.listen(baseConfig.host, () => console.log("http://localhost:"+baseConfig.host));
