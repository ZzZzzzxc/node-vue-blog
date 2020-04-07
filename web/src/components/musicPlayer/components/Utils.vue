<template>
  <div>
    <transition name="fade">
      <ul class="list-wrap song-sheet" v-if="showList">
      <li
        v-for="(item, index) in playList"
        :key="index"
        :class="[currentIndex == index ? 'cur' : '']"
        @click="handleChangeCurrentIndex(index)"
      >
        {{ item.title }}--{{ item.singer }}
      </li>
    </ul>
    </transition>
    <div class="utils">
      <popover position="topRight" :width="100" ref="playTypeControl">
        <div slot="toggle">
          <div class="util" v-if="playType == 0">
            <svg-icon iconClass="ListLoop" />
          </div>
          <div class="util" v-if="playType == 1">
            <svg-icon iconClass="SingleTuneCirculation" />
          </div>
          <div class="util" v-if="playType == 2">
            <svg-icon iconClass="RandomPlay" />
          </div>
        </div>
        <div slot="content">
          <ul class="list-wrap">
            <li
              @click="handleChangePlayType(0)"
              :class="[playType == 0 ? 'cur' : '']"
            >
              列表循环
            </li>
            <li
              @click="handleChangePlayType(1)"
              :class="[playType == 1 ? 'cur' : '']"
            >
              单曲循环
            </li>
            <li
              @click="handleChangePlayType(2)"
              :class="[playType == 2 ? 'cur' : '']"
            >
              随机播放
            </li>
          </ul>
        </div>
      </popover>
      <!-- <popover position="topRight" :width="60">
        <div slot="toggle">
          <div class="util" v-show="!isMuted">
            <svg-icon iconClass="Volume" />
          </div>
          <div class="util" v-show="isMuted">
            <svg-icon iconClass="Mute" />
          </div>
        </div>
        <div slot="content">滚动条</div>
        <div slot="footer">
          <div class="util" v-show="!isMuted" @click="handleToogleMuted">
            <svg-icon iconClass="Volume" />
          </div>
          <div class="util" v-show="isMuted" @click="handleToogleMuted">
            <svg-icon iconClass="Mute" />
          </div>
        </div>
      </popover> -->
      <div class="util" v-show="!isMuted" @click="handleToogleMuted">
            <svg-icon iconClass="Volume" />
          </div>
          <div class="util" v-show="isMuted" @click="handleToogleMuted">
            <svg-icon iconClass="Mute" />
          </div>
      <div class="util" @click="changeCover">
        <svg-icon iconClass="sb" />
      </div>
      <div class="util" @click="toggleListShow">
        <svg-icon iconClass="playlist" />
      </div>
    </div>
  </div>
</template>

<script>
import { player } from "../player";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Utils",
  data() {
    return {
      currentType: 0,
      playList: [],
      showList: false
    };
  },
  computed: { ...mapState(["playType", "isPlayListComplete", "currentIndex","isMuted"]) },
  watch: {
    isPlayListComplete(val) {
      if (val) {
        this.playList = player.playList;
      }
    }
  },
  methods: {
    ...mapMutations(["changePlayType", "changeCover", "changeCurrentIndex"]),
    handleChangePlayType(type) {
      this.$refs.playTypeControl.show = false;
      this.currentType = type;
      player.changePlayType(type);
    },
    handleChangeCurrentIndex(index) {
      this.changeCurrentIndex(index);
      player.playTarget(index);
    },
    toggleListShow() {
      this.showList = !this.showList;
    },
    handleToogleMuted(){
      player.toggleMuted()
    }
  },
  created(){
    if(this.isPlayListComplete){
       this.playList = player.playList;
    }
  },
  mounted() {
    player.onPlayTypeChange.handlers = [];
    // 同步vuex中的播放状态
    player.onPlayTypeChange.listen('playType',() => {
      this.changePlayType(this.currentType);
    });
  }
};
</script>

<style lang="less" scoped>
.song-sheet {
  position: absolute;
  right: 0;
  top: 140px;
  background: #ddd;
  max-height: 210px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
}
.utils {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: start;
  .util {
    margin: 0 10px;
    .svg-icon {
      font-size: 24px;
      transition: 0.6s ease;
      cursor: pointer;
    }
  }
}
.list-wrap {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    height: 28px;
    line-height: 28px;
    font-size: 16px;
    padding: 0 12px;
    border-bottom: 1px solid #e9e9e9;
    cursor: pointer;
    user-select: none;
    transition: font-weight 0.2s ;
    &:hover {
      font-weight: bolder;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  li.cur {
    font-weight: bolder;
  }
}
</style>
