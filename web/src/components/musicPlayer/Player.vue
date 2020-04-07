<template>
  <div class="player">
    <div class="player_bg" v-lazy:background-image="coverUrl"></div>
    <div class="player_content">
      <div class="player_disk">
        <disk />
      </div>
      <div class="player_lrc">
        <lyric />
      </div>
      <div class="player_util">
        <utils />
      </div>
      <div class="player_control">
        <control />
      </div>
      <div class="player_progress">
        <progress-bar />
      </div>
    </div>
  </div>
</template>

<script>
import { player } from "./player";
import Disk from "./components/Disk";
import Control from "./components/Control.vue";
import ProgressBar from "./components/ProgressBar.vue";
import Lyric from "./components/Lyric";
import Utils from "./components/Utils";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Player",
  components: {
    Disk,
    Control,
    ProgressBar,
    Lyric,
    Utils
  },
  data() {
    return { lrc: null };
  },
  computed: { ...mapState(["coverUrl"]) },
  methods: {
    ...mapMutations([
      "togglePlay",
      "changeCover",
      "toggleLoad",
      "toggleError",
      "togglePlayListComplete",
      "changeCurrentIndex",
      "toggleMuted",
      "changePrevIndex"
    ]),
    toggleChangePrevIndex() {
      player.changePrevIndex(player.currentIndex);
      this.changePrevIndex(player.currentIndex);
    }
  },
  mounted() {
    // 添加观察者
    //列表加载状态
    player.onListComplete.listen('checkIsPlayListComplete',() => {
      this.togglePlayListComplete(true);
    });
    // 开始时同步vuex中的状态
    player.onPlay.listen('play',() => {
      this.toggleError(false);
      this.togglePlay(true);
    });
    // 关闭时同步vuex中的状态
    player.onPause.listen('pause',() => {
      this.togglePlay(false);
    });
    // 加载开始时同步vuex中的状态
    player.onLoading.listen('loading',() => {
      this.toggleLoad(true);
    });
    // 加载完成时同步vuex中的状态
    player.onLoadingEnd.listen('loadEnd',() => {
      this.toggleLoad(false);
    });
    // 切歌时随机切换封面
    player.onChange.listen('changeCover',() => {
      this.changeCover();
      this.changeCurrentIndex(player.currentIndex);
    });
    // 播放错误提示
    player.onError.listen('errorInfo',() => {
      this.toggleError(true);
      this.$Message.info({ content: "播放出错了" });
    });
    // 静音状态同步
    player.onMuted.listen('muted',() => {
      this.toggleMuted();
    });
    // 上一首
    player.onPrev.listen('prev',() => {
      this.toggleChangePrevIndex();
    });
    // 下一首
    player.onNext.listen('next',() => {
      this.toggleChangePrevIndex();
    });
    // 播放指定歌曲
    player.onPlayTarget.listen('playTarget',() => {
      this.toggleChangePrevIndex();
    });
  }
};
</script>

<style lang="less">
.player {
  height: 750px;
  width: 90%;
  max-width: 900px;
  border-radius: 15px;
  margin: 5% auto;
  position: relative;
  border: hsla(39, 94%, 50%, 0.6) solid;
  background-color: #ddd;
  .player_bg {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: absolute;
    filter: blur(15px);
  }
  .player_content {
    position: absolute;
    left: 10px;
    right: 10px;
    .player_disk {
      position: relative;
      top: -3rem;
      height: 16rem;
      width: 16rem;
      margin: 0 auto;
    }
    .player_control {
      width: 200px;
      margin: 0 auto;
      height: 70px;
    }
    .player_progress {
      width: 80%;
      margin: 0 auto;
    }
    .player_lrc {
      height: 200px;
      width: 100%;
      margin: 0 auto 2rem auto;
    }
    .player_util {
      height: 40px;
      margin: 0 auto;
      width: 100%;
    }
  }
}
</style>
