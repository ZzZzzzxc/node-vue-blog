import Api from "./api";
// 页面调用方法
//文章列表
export async function getArticlesList(req) {
  let res = await Api.fetchArticlesList(req);
  return res;
}
//导航栏
export async function getNavList() {
  let res = await Api.fetchNavList();
  return res;
}
//文章详情
export async function getArticleDetail(id) {
  let res = await Api.fetchArticlesDetail(id);
  return res;
}
//关于我
export async function getAboutMe() {
  let res = await Api.fetchAboutMe();
  return res;
}
//获取友链
export async function getFriendLink() {
  let res = await Api.fetchFriendLink();
  return res;
}
//获取标签列表
export async function getTagList() {
  let res = await Api.fetchTagList();
  return res;
}
//根据标签获取文章列表
export async function getArticlesByTag(id) {
  let res = await Api.fetchArticlesByTag(id);
  return res;
}
//歌曲列表
export async function getMusicList() {
  let res = await Api.fetchMusicList();
  return res;
}
