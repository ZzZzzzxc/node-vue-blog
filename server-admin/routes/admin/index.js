module.exports = app => {
  const express = require("express");
  const router = express.Router({
    //父级路由合并到子级路由
    mergeParams: true
  });

  const resourceMiddleware = require("../../middleware/resource");
  const authMiddleware = require("../../middleware/auth");
  const timeout = require("../../middleware/timeout");
  //新建接口
  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  //修改接口
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  //删除接口
  router.delete("/:id", async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send();
  });
  //查询所有接口
  router.get("/", async (req, res) => {
    if (req.Model.modelName === "Article") {
      const keyword = req.query.key || "";
      const reg = new RegExp(keyword, "i");
      //模糊查询
      const model = await req.Model.find({
        $or: [{ title: { $regex: reg } }, { description: { $regex: reg } }]
      })
        .populate("tags")
        .lean()
        .sort({ _id: -1 });
      res.send(model);
    } else if (req.Model.modelName === "User") {
      const keyword = req.query.key || "";
      const reg = new RegExp(keyword, "i");
      //模糊查询
      const model = await req.Model.find({
        $or: [{ name: { $regex: reg } }, { account: { $regex: reg } }]
      })
        .populate("roles")
        .lean()
        .sort({ _id: -1 });
      res.send(model);
    } else {
      const keyword = req.query.key || "";
      const reg = new RegExp(keyword, "i");
      const model = await req.Model.find({
        $or: [{ title: { $regex: reg } }]
      }).sort({ _id: -1 });
      res.send(model);
    }
  });
  //查询详情接口
  router.get("/:id", async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    });
  });
  //挂载子路由
  app.use(
    "/admin/api/rest/:resource",
    authMiddleware(),
    resourceMiddleware(),
    timeout(),
    router
  );
};
