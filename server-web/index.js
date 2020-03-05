// 创建一个express应用程序
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require('compression');
const history = require('connect-history-api-fallback');
app.use(express.json());
//CORS跨域的中间件
app.use(cors());
//gzip
app.use(compression())
//vue 路由
app.use(history());
//静态资源托管
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/", express.static(__dirname + "/public/dist"));
//设置一个密钥
app.set("secret", "i2u34y12oi3u4y8");
//将实例app注入模块内
require("./plugins/db")(app);
require("./routes/web")(app);

app.listen(3001, () => console.log("http://localhost:3001"));
