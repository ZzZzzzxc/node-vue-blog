<template>
  <div class="control">
    <div class="prev" @click="prev"><svg-icon iconClass="prev" /></div>
    <div class="center" @click="handleChange">
      <div v-if="isPlaying"><svg-icon iconClass="pause" /></div>
      <div v-else><svg-icon iconClass="play" /></div>
    </div>
    <div class="next" @click="next"><svg-icon iconClass="next" /></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { player } from "./player";
export default {
  name: "",
  data() {
    return {};
  },
  computed: { ...mapState(["isPlaying","isLoading"]) },
  methods: {
    handleChange() {
      if (!this.isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    },
    prev() {
      player.prev();
    },
    next() {
      player.next();
    }
  }
};
</script>

<style lang="less" scoped>
.control {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .prev {
    cursor: pointer;
    width: 40px;
    height: 40px;
    font-size: 40px;
    line-height: 40px;
  }
  .center {
    cursor: pointer;
    text-align: center;
    height: 60px;
    width: 60px;
    line-height: 48px;
    font-size: 40px;
    border: #fff 4px solid;
    border-radius: 50%;
  }
  .next {
    cursor: pointer;
    width: 40px;
    height: 40px;
    font-size: 40px;
    line-height: 40px;
  }
}
</style>
