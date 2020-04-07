<template>
  <div>
    <div class="comments-title">评论区</div>
    <div id="vcomments" :key="$route.path + +new Date()"></div>
  </div>
</template>
<script>
import Valine from "valine";
import "./valine.less";
export default {
  name: "valine-comments",
  mounted() {
    new Valine({
      el: "#vcomments",
      appId: "Iwe3WrP7dY5p9C7eQUKGkhcg-gzGzoHsz",
      appKey: "s7Ca5zrDw6Jme0Qt8B4uhz7W",
      placeholder: "快来评论吧💕（支持Markdown语法）",
      path: this.$route.params.id || this.$route.name,
      avatar: "robohash",
      pageSize: 8,
      recordIP: true,
      notify: true
      // verify:"true"
    });
  }
};
</script>
