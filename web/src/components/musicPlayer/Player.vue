<template>
  <div class="player">
    <div class="player_disk">
      <disk />
    </div>
    <div class="player_control">
      <control />
    </div>
    <div class="player_progress">
      <progress-bar />
    </div>
  </div>
</template>

<script>
import { getMusicList } from "../../services/index";
import { player } from "./player";
import Disk from "./Disk.vue";
import Control from "./Control.vue";
import ProgressBar from "./ProgressBar.vue";
import { mapMutations } from "vuex";
export default {
  name: "",
  components: {
    Disk,
    Control,
    ProgressBar
  },
  methods: {
    ...mapMutations(["togglePlay",'changeCover'])
  },
  created() {
    getMusicList()
      .then(res => {
        player.getList(res);
      })
      .catch(err => {
        this.$Message.info({ content: err });
      });
  },
  mounted() {
    player.onPlay.listen(() => {
      this.togglePlay(true);
    });
    player.onPause.listen(() => {
      this.togglePlay(false);
    });
    player.onChange.listen(() => {
      this.changeCover();
    });
  }
};
</script>

<style lang="less">
.player {
  height: 400px;
  width: 330px;
  box-shadow: 0px 15px 35px -5px rgba(50, 88, 130, 0.32);
  border-radius: 15px;
  margin:100px auto;
  background: #eef3f7;
  padding: 0 40px;
  .player_disk {
    height: 200px;
    width: 200px;
    margin: 0 auto;
    position: relative;
    top: -80px;
    box-shadow: 0px 15px 35px -5px rgba(50, 88, 130, 0.32);
  }
  .player_control {
    width: 100%;
    height: 70px;
    position: relative;
    top: -40px;
  }
  .player_progress {
    width: 100%;
    height: 300px;
    position: relative;
    top: -40px;
  }
}
</style>
