import Axios from "../../plugins/axios";
// 请求后端接口
export default {
  //文章列表
  fetchArticlesList(req) {
    return Axios.get("/articles/list", { params: req });
  },
  //导航栏
  fetchNavList() {
    return Axios.get("/nav/list");
  },
  //文章详情
  fetchArticlesDetail(id) {
    return Axios.get("/article/" + id);
  },
  //获取关于我页面
  fetchAboutMe() {
    return Axios.get("/about");
  },
  //获取友链
  fetchFriendLink() {
    return Axios.get("/friend");
  },
  //获取标签列表
  fetchTagList() {
    return Axios.get("/tag/list");
  },
  //根据标签获取文章列表
  fetchArticlesByTag(id) {
    return Axios.get("/tag/" + id);
  },
  //获取歌曲列表
  fetchMusicList(id) {
    return Axios.get("/music/list");
  }
};
