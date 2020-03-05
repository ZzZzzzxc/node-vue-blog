module.exports = app => {
  const express = require("express");
  const router = express.Router({
    mergeParams: true
  });
  const multer = require("multer");
  const fs = require("fs");
  const request = require("request");
  const assert = require("http-assert");
  const jwt = require("jsonwebtoken");
  const authMiddleware = require("../../middleware/auth");
  const timeout = require("../../middleware/timeout");
  const uploadConfig = app.get("uploadConfig");

  const createFolder = function(folder) {
    try {
      fs.accessSync(folder);
    } catch (e) {
      fs.mkdirSync(folder);
    }
  };
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      if (!uploadConfig.mimetype[file.mimetype]) {
        assert(err, 500, "上传错误");
        return false;
      }
      const childFloder = uploadConfig.mimetype[file.mimetype];
      createFolder(__dirname + "/../../uploads/" + childFloder);
      file.childFloder = childFloder;
      cb(null, __dirname + "/../../uploads/" + childFloder + "/");
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  const upload = multer({ storage: storage }).single("file");
  // 处理文件上传
  app.post("/admin/api/upload", async (req, res) => {
    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        assert(err, 500, "上传错误");
      } else if (err) {
        assert(err, 500, "上传错误");
      }
      const file = req.file;
      const uploadConfig = req.app.get("uploadConfig");
      file.url =
        uploadConfig.filePath + "/" + file.childFloder + "/" + file.filename;
      res.send(file);
    });
  });
  //github登录
  app.get("/admin/api/github/login", async (req, res, next) => {
    let param = req.query || req.params;
    let code = param.code || "";
    let githubConfig = req.app.get("githubConfig");
    if (code == "") {
      res.end(
        JSON.stringify({
          msg: "你参数呢",
          status: 103
        })
      );
      return;
    }
    request(
      {
        url: githubConfig.access_token_url,
        form: {
          client_id: githubConfig.client_ID,
          client_secret: githubConfig.client_Secret,
          code: code,
          redirect_uri: githubConfig.redirect_uri
        }
      },
      (error, response, resbody) => {
        if (!error && response.statusCode == 200) {
          let urlStr = githubConfig.user_info_url + resbody;
          let bodyArr = {};
          for (let i = 0; i < resbody.split("&").length; i++) {
            let tmp = resbody.split("&")[i].split("=");
            bodyArr[tmp[0]] = tmp[1];
          }
          request(
            {
              url: urlStr,
              headers: {
                Authorization: bodyArr.access_token,
                "User-Agent": githubConfig.github_ID
              }
            },
            (error, response, resbody) => {
              if (!error) {
                let data = JSON.parse(resbody),
                  role =
                    data.login == githubConfig.github_ID ? "admin" : "guest";
                const token = jwt.sign(
                  { id: data.login, role: role },
                  app.get("secret"),
                  { expiresIn: 60 * 60 * 24 * 7 }
                );
                data.token = token;
                data.login_way = "github";
                res.end(
                  JSON.stringify({
                    msg: "sucess",
                    status: 100,
                    data: data
                  })
                );
              } else {
                res.end(JSON.stringify(error));
              }
            }
          );
        } else {
          response.end(JSON.stringify(error));
        }
      }
    );
  });
  //七牛云文件上传(给前端token)
  const qiniu = require("qiniu");
  const qiniuConfig = app.get("qiniuConfig");
  app.post("/admin/api/upload/qiniu", async (req, res) => {
    //鉴权对象
    let mac = new qiniu.auth.digest.Mac(
      qiniuConfig.accessKey,
      qiniuConfig.secretKey
    );
    let putPolicy = new qiniu.rs.PutPolicy(qiniuConfig.options);
    let uploadToken = await putPolicy.uploadToken(mac);
    res.end(
      JSON.stringify({
        uploadToken: uploadToken,
        status: 200
      })
    );
  });
  // 获取用户权限
  app.get("/admin/api/user", async (req, res) => {
    const token = String(req.headers.authorization || "")
      .split(" ")
      .pop();
    const { id, role } = jwt.verify(
      token,
      req.app.get("secret"),
      (err, decoded) => {
        if (err) {
          err = {
            message: "请先登录"
          };
          return err;
        }
        return decoded;
      }
    );
    res.end(
      JSON.stringify({
        id: id,
        role: role
      })
    );
  });
  //根据GitHub用户id获取信息
  app.get("/admin/api/getUserInfo/github/:id", async (req, res) => {
    if (!req.params.id) {
      res.end(
        JSON.stringify({
          msg: "你参数呢",
          status: 103
        })
      );
    }
    let id = req.params.id;
    let githubConfig = req.app.get("githubConfig");
    let url = `https://api.github.com/users/${id}`;
    request(
      {
        url: url,
        headers: {
          "User-Agent": githubConfig.github_ID
        }
      },
      (err, response, resbody) => {
        if (!err) {
          res.send(JSON.parse(resbody));
        } else {
          res.end(JSON.stringify(err));
        }
      }
    );
  });
  //游客登录
  app.get("/admin/api/guest/login", async (req, res) => {
    let data = {};
    const token = jwt.sign(
      { id: "一位没有姓名的游客", role: "guest" },
      app.get("secret"),
      {
        expiresIn: 60 * 60 * 24 * 7
      }
    );
    data.token = token;
    data.login_way = "guest";
    res.end(
      JSON.stringify({
        msg: "sucess",
        status: 200,
        data: data
      })
    );
  });
  //本站账户登录
  const User = require("../../models/User");
  const Role = require("../../models/Role");
  app.post("/admin/api/noumenon/login", async (req, res) => {
    const { username, password } = req.body;
    // 1.根据用户名找用户
    const user = await User.findOne({ account: username }).select("+password");
    assert(user, 422, "用户不存在");
    // 2.校验密码
    const isValid = require("bcryptjs").compareSync(password, user.password);
    assert(isValid, 422, "密码错误");
    // 3.返回token
    let roleConfig = req.app.get("roleConfig");
    const data = {};
    let roleTitle = await Role.findById({ _id: user.roles[0] });
    let role = roleConfig.includes(roleTitle.title)
      ? roleTitle.title
      : roleConfig.pop();
    const token = jwt.sign({ id: user.name, role: role }, app.get("secret"), {
      expiresIn: 60 * 60 * 24 * 7
    });
    data.role = role;
    data.token = token;
    data.login_way = "noumenon";
    res.send(
      JSON.stringify({
        msg: "sucess",
        status: 200,
        data: data
      })
    );
  });
  //获取本站用户信息
  app.get("/admin/api/getUserInfo/noumenon", async (req, res) => {
    const token = String(req.headers.authorization || "")
      .split(" ")
      .pop();
    const { id, role } = jwt.verify(
      token,
      req.app.get("secret"),
      (err, decoded) => {
        if (err) {
          err = {
            message: "请先登录"
          };
          return err;
        }
        return decoded;
      }
    );
    res.end(
      JSON.stringify({
        login: id,
        avatar_url: "https://cdn.zhangxc.cn/FsSLNBGh3Abl90Vc106yKhyJMUeX"
      })
    );
  });
  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    });
  });
  //挂载子路由
  app.use("/admin/api", authMiddleware(), timeout(), router);
};
