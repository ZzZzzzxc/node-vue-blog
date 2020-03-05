export default {
    el: "#vcomments",
    appId: "your appId",
    appKey: "your appKey",
    placeholder: "快来评论吧💕（支持Markdown语法）",
    path: this.$route.params.id || this.$route.name,
    avatar: "robohash",
    pageSize: 8,
    recordIP: true,
    notify: true
    // verify:"true"
  }