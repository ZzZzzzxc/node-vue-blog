<template>
  <transition name="fade">
    <div class="disk">
      <div v-if="isLoading">loading</div>
      <div
        v-else
        class="disk_cover"
        :style="{
          backgroundImage: coverUrl ? `url(${coverUrl})` : ''
        }"
      />
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {};
  },
  computed: { ...mapState(["isPlaying", "coverUrl", "isLoading"]) },
  methods: {}
};
</script>

<style lang="less" scoped>
.disk {
  width: 100%;
  height: 100%;
  position: relative;
  .disk_cover {
    height: 100%;
    width: 100%;
    border-radius: 15px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .disk_cover:after {
    content: "";
    background: inherit;
    width: 100%;
    height: 100%;
    box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
    display: block;
    z-index: 2;
    position: absolute;
    border-radius: 15px;
  }
  .disk_cover:before {
    content: "";
    background: inherit;
    width: 100%;
    height: 100%;
    box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
    display: block;
    z-index: 1;
    position: absolute;
    top: 30px;
    transform: scale(0.9);
    filter: blur(10px);
    opacity: 0.9;
    border-radius: 15px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
