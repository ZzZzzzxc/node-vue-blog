<template>
  <div
    class="lyc_container"
    ref="lyc_container"
    @mouseenter="toggleScroll(false)"
    @mouseleave="toggleScroll(true)"
  >
    <div
      v-for="(item, index) in lrc"
      :key="index"
      :class="[lyricIndex == index ? `cur line` : `line`]"
      @click="toTargetTime(item.time)"
    >
      <span class="time">{{ item.time | timeFilter }}</span>
      <span>{{ item.txt }}</span>
    </div>
  </div>
</template>

<script>
import { player } from "../player";
import { mapState, mapMutations } from "vuex";
import { parseLrc } from "../utils/parse";
let cur = document.getElementsByClassName("cur");
export default {
  name: "Lyric",
  computed: {
    ...mapState(["isPlaying", "isError", "isLoading", "currentLrc"])
  },
  data() {
    return {
      // 当前歌词行
      lyricIndex: 0,
      // 定时器
      lrcTimer: null,
      // 是否需要自动滚动
      isLrcScroll: true,
      lrc: [{ txt: "暂无歌词，请欣赏" }]
    };
  },
  watch: {},
  methods: {
    ...mapMutations(["changeCurrentLrc"]),
    fetchLrc(fileUrl) {
      // 判断是否有缓存
      if (player.current.lrcCache) {
        this.lrc = player.current.lrcCache;
        return;
      }
      let lrc;
      // 判断是否上传了歌词
      if (!fileUrl) {
        lrc = [{ txt: "暂无歌词，请欣赏" }];
        player.current.lrcCache = lrc;
        this.lrc = lrc;
      } else {
        axios.get(fileUrl).then(res => {
          lrc = parseLrc(res);
          player.current.lrcCache = lrc;
          this.lrc = lrc;
        });
      }
    },
    // 歌词滚动
    lycAutoScroll(time = 800) {
      clearInterval(this.lrcTimer);
      this.lrcTimer = setInterval(this.observe, time);
    },
    // 判断歌词是否需要滚动
    observe(needToCheck = true) {
      let duration = player.duration,
        currentTime = player.currentTime;
      if (currentTime >= duration) {
        this.lycComplete();
        return;
      }
      if (!this.lrc) {
        return;
      }
      for (let i = 0; i < this.lrc.length; i++) {
        let next = this.lrc[i + 1] ? this.lrc[i + 1] : null,
          flag = this.isLrcScroll || !needToCheck;
        // 是否为最后一行
        if (next) {
          if (currentTime > this.lrc[i].time && currentTime < next.time) {
            if (flag) {
              this.scrollToTargetLine(i);
            }
            this.lyricIndex = i;
            break;
          }
        } else {
          if (currentTime > this.lrc[i].time) {
            if (flag) {
              this.scrollToTargetLine(i);
            }
            this.lyricIndex = i;
            break;
          }
        }
      }
    },
    // 播放完成
    lycComplete() {
      clearInterval(this.lrcTimer);
      this.lyricIndex = 0;
    },
    // 滚动至目标行
    scrollToTargetLine(index) {
      let n = index - 3 > 0 ? index - 3 : 0;
      this.lyricIndex = index;
      if (this.$refs.lyc_container) {
        this.$refs.lyc_container.scrollTo({
          top: n * 30,
          behavior: "smooth"
        });
      }
    },
    // 触发歌词自动滚动开关
    toggleScroll(bool) {
      this.isLrcScroll = bool;
    },
    // 点击歌词修改播放进度
    toTargetTime(target) {
      if (target) {
        player.toTargetTime(target);
        this.observe(false);
      }
    },
    //重置状态
    resetLrc() {
      this.lyricIndex = 0;
      this.scrollToTargetLine(0);
    }
  },
  filters: {
    timeFilter: function(value) {
      if (!value) return "";
      let s = Number(value).toFixed(0);

      let mm = Math.floor(s / 60).toFixed(0);
      let ss = (s - mm * 60).toFixed(0);
      if (mm.length < 2) {
        mm = `0${mm}`;
      }
      if (ss.length < 2) {
        ss = `0${ss}`;
      }
      return `${mm}:${ss}`;
    }
  },
  created() {
    this.fetchLrc(player.current.lrc);
    this.lycAutoScroll(1000);
  },
  mounted() {
    // 开始播放时开始监听
    player.onPlay.listen('autoScroll',() => {
      this.lycAutoScroll(1000);
    });
    // 暂停时移除监听
    player.onPause.listen('clearTimer',() => {
      clearInterval(this.lrcTimer);
    });
    // 切歌时读取在线歌词文件
    player.onChange.listen('fetchLrc',() => {
      this.fetchLrc(player.current.lrc);
    });
    // 切歌重置状态
    player.onPrev.listen('resetLrc',() => {
      this.resetLrc();
    });
    player.onNext.listen('resetLrc',() => {
      this.resetLrc();
    });
    player.onPlayTarget.listen('resetLrc',() => {
      this.resetLrc();
    });
  },
  beforeDestroy() {
    clearInterval(this.lrcTimer);
  }
};
</script>

<style lang="less" scoped>
.lyc_container {
  height: 200px;
  width: 100%;
  text-align: center;
  overflow-y: scroll;
  position: absolute;
  .line {
    color: #fff;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    transition: 0.2s;
  }
  .line:hover {
    span {
      border-bottom: hsla(39, 94%, 50%, 1) solid;
    }
    .time {
      opacity: 1;
    }
  }
  .time {
    opacity: 0;
    position: absolute;
    left: 0;
    color: hsla(39, 94%, 50%, 1);
    font-weight: bold;
  }
  .cur {
    color: hsla(39, 94%, 50%, 1);
    font-weight: bold;
  }
}
.lyc_container::-webkit-scrollbar {
  width: 0;
}
</style>
