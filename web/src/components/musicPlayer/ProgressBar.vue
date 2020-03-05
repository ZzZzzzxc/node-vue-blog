<template>
  <div class="progress">
    <div class="info">
      <div class="album">
        <div class="name">{{ title }}</div>
        <div class="singer">{{ singer }}</div>
      </div>
      <div class="duration" v-if="duration">
        {{ currentTime | formatTime }}/{{ duration | formatTime }}
      </div>
    </div>
    <div class="bar" @click="toTargetPercentage" ref="bar">
      <div class="current" :style="{ width: progress }"></div>
    </div>
  </div>
</template>
<script>
import { player } from "./player";
import { mapMutations } from "vuex";
export default {
  name: "",
  data() {
    return {
      title: "",
      singer: "",
      duration: "",
      currentTime: "",
      progress: "",
      percentage: "",
      targetPercentage: 0,
      barWidth: 0,
      readyState: 0
    };
  },
  watch: {
    percentage(val) {
      if (val > 99.5) {
        player.next();
      }
    },
    targetPercentage(val) {
      player.toTargetTime(val * this.duration);
    },
    readyState(val) {
      switch (val) {
        case 0:
          this.toggleLoad(true);
          console.log("没有关于音频或视频是否就绪的信息");
           break;
        case 1:
          this.toggleLoad(true);
          console.log("关于音频或视频就绪的元数据");
           break;
        case 2:
          this.toggleLoad(true);
          console.log(
            "关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧"
          );
           break;
        case 3:
          this.toggleLoad(true);
          console.log("当前及至少下一帧的数据是可用的");
           break;
        case 4:
          this.toggleLoad(false);
          console.log("可用数据足以开始播放");
      }
    }
  },
  filters: {
    formatTime(val) {
      const min = Math.floor(val / 60);
      const sec = Math.floor(val % 60);
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }
  },
  methods: {
    ...mapMutations(["toggleLoad"]),
    toTargetPercentage(e) {
      this.targetPercentage = (e.offsetX / this.barWidth).toFixed(2);
    }
  },
  mounted() {
    this.barWidth = this.$refs.bar.offsetWidth;
    const draw = () => {
      requestAnimationFrame(draw);
      this.title = player.current.title ? player.current.title : "";
      this.singer = player.current.singer ? player.current.singer : "";
      this.readyState = player.readyState;
      const progress = player.currentTime / player.duration;
      this.percentage = (progress * 100).toFixed(2);
      this.progress = `${this.percentage}%`;
      this.duration = player.duration ? player.duration : "";
      this.currentTime = player.currentTime ? player.currentTime : "0";
    };
    draw();
  }
};
</script>
<style lang="less" scoped>
.progress {
  .info {
    color: #71829e;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    height: 120px;
    .album {
      height: 50px;
      margin: auto 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .name {
        font-weight: bold;
      }
      .singer {
        opacity: 0.7;
      }
    }
    .duration {
      height: 140px;
      line-height: 140px;
    }
  }
  .bar {
    height: 6px;
    width: 100%;
    background-color: #d0d8e6;
    display: inline-block;
    border-radius: 10px;
    .current {
      height: inherit;
      background-color: #a3b3ce;
      border-radius: 10px;
    }
  }
}
</style>
