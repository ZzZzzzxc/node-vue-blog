module.exports = app => {
  const router = require("express").Router();
  const mongoose = require("mongoose");
  mongoose.set("useFindAndModify", false);
  const Article = mongoose.model("Article");
  const Nav = mongoose.model("Nav");
  const About = mongoose.model("AboutMe");
  const FriendLink = mongoose.model("FriendLink");
  const Tag = mongoose.model("Tag");
  const Music = mongoose.model("Music");
  const request = require("request");
  const timeout = require("../../middleware/timeout");
  //文章列表
  router.get("/articles/list", async (req, res) => {
    let page = req.query.page || 1000;
    let current = req.query.current || 0;
    const data = await Article.find(
      {},
      { context: 0, contextHtml: 0, catalog: 0 }
    )
      .populate("tags")
      .lean()
      .skip(page * current * 1)
      .limit(page * 1)
      .sort({ _id: -1 });
    res.send(data);
  });
  //导航栏
  router.get("/nav/list", async (req, res) => {
    const data = await Nav.find();
    res.send(data);
  });
  //文章详情
  router.get("/article/:id", async (req, res) => {
    const data = await Article.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { nums: 1 } }
    )
      .populate("tags")
      .lean();
    res.send(data);
  });
  //关于我
  router.get("/about", async (req, res) => {
    const data = await About.find();
    res.send(data[0]);
  });
  //友链列表
  router.get("/friend", async (req, res) => {
    const data = await FriendLink.find().sort({ _id: -1 });
    res.send(data);
  });
  router.get("/tag/list", async (req, res) => {
    const data = await Tag.find().sort({ _id: -1 });
    res.send(data);
  });
  //根据标签筛选文章
  router.get("/tag/:id", async (req, res) => {
    const result = await Tag.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "tags",
          as: "articlesList"
        }
      },
      {
        $project: {
          "articlesList.context": 0,
          "articlesList.contextHtml": 0,
          "articlesList.catalog": 0
        }
      }
    ]).sort({ _id: -1 });
    res.send(result);
  });
  //歌曲列表
  router.get("/music/list", async (req, res) => {
    const data = await Music.find();
    res.send(data);
  });
  // 错误处理函数
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    });
  });
  app.use("/web/api/rest", timeout(), router);
};
