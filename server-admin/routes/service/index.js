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
        assert(!err, 500, "multer错误导致上传失败");
      } else if (err) {
        assert(!err, 500, "上传错误");
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
    assert(code, 503, "参数缺失");
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
        if (error) {
          res.end(err);
        }
        if (response.statusCode == 200) {
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
              if (error) {
                res.end(error);
              }
              let data = JSON.parse(resbody),
                role = data.login == githubConfig.github_ID ? "admin" : "guest";
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
            }
          );
        }
      }
    );
  });
  //七牛云
  const qiniu = require("qiniu");
  const qiniuConfig = app.get("qiniuConfig");
  //鉴权对象
  const mac = new qiniu.auth.digest.Mac(
    qiniuConfig.accessKey,
    qiniuConfig.secretKey
  );
  const cdnManager = new qiniu.cdn.CdnManager(mac);
  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z2;
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  //七牛云文件上传(给前端token)
  app.post("/admin/api/qiniu/upload", async (req, res) => {
    let key = req.body.key || "";
    const options = {
      scope: `zhangxc-blog`,
      saveKey:key,
      expires: 7200,
      insertOnly: 0,
      returnBody: `{
        "key":"$(key)",
        "hash":"$(etag)",
        "fsize":$(fsize),
        "bucket":"$(bucket)",
        "name":"$(x:name)",
        "url":"https://cdn.zhangxc.cn/$(key)"
      }`
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = await putPolicy.uploadToken(mac);
    res.end(
      JSON.stringify({
        uploadToken: uploadToken,
        status: 200
      })
    );
  });
  //获取七牛云存储桶下文件列表
  app.get("/admin/api/qiniu/bucket/list/:type", async (req, res) => {
    let bucket = "zhangxc-blog",prefix=req.params.type||'';
    if(prefix==="all"){
      prefix = ''
    }
    let options = {
      limit: 10000,
      prefix: prefix
    };
    bucketManager.listPrefix(bucket, options, function(
      err,
      respBody,
      respInfo
    ) {
      if (err) {
        console.log(err);
      } else {
        if (respInfo.statusCode == 200) {
          res.end(JSON.stringify(respBody));
        } else {
          res.end(
            JSON.stringify({
              status: respInfo.statusCode,
              error: respBody.error
            })
          );
        }
      }
    });
  });
  //获取七牛云存储桶下文件详情
  app.get("/admin/api/qiniu/bucket/file:key", async (req, res) => {
    let bucket = "zhangxc-blog";
    let key = req.params.key || "";
    bucketManager.stat(bucket, key, function(err, respBody, respInfo) {
      if (err) {
        console.log(err);
      } else {
        if (respInfo.statusCode == 200) {
          res.end(JSON.stringify(respBody));
        } else {
          res.end(
            JSON.stringify({
              status: respInfo.statusCode,
              error: respBody.error
            })
          );
        }
      }
    });
  });
  //获取七牛云域名流量
  app.get("/admin/api/qiniu/domain/flow", async (req, res) => {
    let param = req.query || req.params;
    console.log(param)
    assert(param, 503, "参数错误");
    //指定日期
    let startDate = param.startDate || "2020-02-10";
    let endDate = param.endDate || "2020-02-20";
    let granularity = "day";
    //获取域名流量
    cdnManager.getFluxData(
      startDate,
      endDate,
      granularity,
      qiniuConfig.domains,
      function(err, respBody, respInfo) {
        if (err) {
          res.end(err);
        }
        if (respInfo.statusCode == 200) {
          let fluxData = respBody.data,
            data = {};
          qiniuConfig.domains.forEach(domain => {
            let fluxDataOfDomain = fluxData[domain];
            if (fluxDataOfDomain != null) {
              data.fluxChina = fluxDataOfDomain["china"]?fluxDataOfDomain["china"]:[];
              data.fluxOversea = fluxDataOfDomain["oversea"]?fluxDataOfDomain["oversea"]:[];
            }
          });
          res.end(JSON.stringify(data));
        } else {
          res.end(JSON.stringify(respInfo));
        }
      }
    );
  });
  //获取七牛云域名带宽
  app.get("/admin/api/qiniu/domain/bandwidth", async (req, res) => {
    let param = req.query || req.params;
    assert(param, 503, "参数错误");
    //指定日期
    let startDate = param.startDate || "2020-02-10";
    let endDate = param.endDate || "2020-02-20";
    var granularity = "day";
    //获取域名带宽
    cdnManager.getBandwidthData(
      startDate,
      endDate,
      granularity,
      qiniuConfig.domains,
      function(err, respBody, respInfo) {
        if (err) {
          res.end(err);
        }
        if (respInfo.statusCode == 200) {
          let bandwidthData = respBody.data,
            data = {};
          qiniuConfig.domains.forEach(function(domain) {
            let bandwidthDataOfDomain = bandwidthData[domain];
            if (bandwidthDataOfDomain != null) {
              data.bandwidthChina = bandwidthDataOfDomain["china"]?bandwidthDataOfDomain["china"]:[];
              data.bandwidthOversea = bandwidthDataOfDomain["oversea"]?bandwidthDataOfDomain["oversea"]:[];
            }
          });
          res.end(JSON.stringify(data));
        } else {
          res.end(JSON.stringify(respInfo));
        }
      }
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
    let id = req.params.id;
    assert(id, 503, "未能够正确获取用户id");
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
        assert(!err, 503, err);
        res.send(resbody);
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
