<template>
  <div class="control" :class="{ control__playing: isPlaying }">
    <div class="prev" @click="prev"><svg-icon iconClass="prev" /></div>
    <div class="control_btn" @click="handleChange">
      <loading v-if="isLoading" />
      <span v-else class="play-btn" />
    </div>
    <div class="next" @click="next"><svg-icon iconClass="next" /></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { player } from "../player";
export default {
  name: "",
  data() {
    return {};
  },
  computed: { ...mapState(["isPlaying", "isLoading"]) },
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
    transition: 0.6s ease;
  }
  .prev:hover {
    transform: rotate(-10deg);
  }
  .control_btn {
    display: flex;
    margin: 2px;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #ccc;
    font-size: 40px;
    height: 40px;
    max-width: 40px;
    transition: 0.6s ease;
    border-radius: 50%;
  }
  .control_btn:hover {
    background-color: #ddd;
    color: white;
    transform: rotate(10deg);
  }
  .play-btn {
    position: relative;
    width: 20px;
    height: 40px;
  }
  .play-btn::before {
    content: "";
    position: absolute;
    left: 11px;
    top: 50%;
    margin-left: -4px;
    margin-top: -10px;
    width: 0;
    height: 0;
    border: 12px solid transparent;
    border-left-color: #fff;
    border-top-width: 10px;
    border-bottom-width: 10px;
    transition: all 0.2s ease;
  }
  .play-btn::after {
    content: "";
    position: absolute;
    right: 5px;
    top: 50%;
    margin-right: -4px;
    margin-top: -10px;
    width: 0;
    height: 20px;
    border: 0 solid transparent;
    border-width: 0 0 0 6px;
    border-left-color: #fff;
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
  }
  .next {
    cursor: pointer;
    width: 40px;
    height: 40px;
    font-size: 40px;
    line-height: 40px;
    transition: 0.6s ease;
  }
  .next:hover {
    transform: rotate(10deg);
  }
}
.control__playing .play-btn::before {
  border-width: 0 0 0 6px;
  height: 20px;
  left: 5px;
}
.control__playing .play-btn::after {
  opacity: 1;
  transform: scale(1);
}
</style>
