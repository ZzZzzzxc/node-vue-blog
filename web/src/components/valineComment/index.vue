<template>
  <div>
    <div class="comments-title">评论区</div>
    <div id="vcomments" :key="$route.path + +new Date()"></div>
  </div>
</template>
<script>
import Valine from "valine";
import "./valine.less";
import valinePlugin from '../../plugins/valine'
export default {
  name: "valine-comments",
  mounted() {
    new Valine(valinePlugin);
  }
};
</script>
