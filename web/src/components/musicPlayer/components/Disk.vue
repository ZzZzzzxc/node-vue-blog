<template>
  <div
    class="disk"
    :class="{ disk__playing: !isLoading && !isError && isPlaying }"
  >
    <div
      class="disk_cover"
      ref="cover"
      :style="{
        transform: stopMatrix
      }"
      v-lazy:background-image="coverUrl"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { player } from "../player";
export default {
  name: "",
  data() {
    return {
      stopMatrix: ""
    };
  },
  computed: { ...mapState(["isPlaying", "coverUrl", "isError", "isLoading"]) },
  watch: {
    isPlaying(val) {
      if (!val) {
        this.stopMatrix = window.getComputedStyle(this.$refs.cover).transform;
      } else {
        const matrix = this.stopMatrix;
        this.stopMatrix = "";
        const match = matrix.match(/^matrix\(([^,]+),([^,]+)/);
        const [, sin, cos] = match || [0, 0, 0];
        const deg = ((Math.atan2(cos, sin) / 2 / Math.PI) * 360) % 360;
        const styles = [...document.styleSheets];
        styles.forEach(style => {
          const rules = [...style.cssRules];
          rules.forEach(rule => {
            if (
              rule.type === rule.KEYFRAMES_RULE &&
              rule.name.indexOf("disk_rotate") > -1
            ) {
              rule.cssRules[0].style.transform = `rotate(${deg}deg)`;
              rule.cssRules[1].style.transform = `rotate(${deg + 360}deg)`;
            }
          });
        });
      }
    }
  },
  mounted() {
    // 当切歌的时候重置旋转角度
    player.onChange.listen('resetMatrix',() => {
      this.stopMatrix = "";
    });
  }
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
    border-radius: 50%;
    position: absolute;
    border: hsla(39, 94%, 50%, 0.6) solid;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    left: 0;
    top: 0;
  }
  .disk_cover::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -8px;
    margin-top: -8px;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    background-image: linear-gradient(45deg, white, #dabad1);
    box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2);
  }
}
.disk__playing .disk_cover {
  animation: disk_rotate infinite 6s linear;
}
@keyframes disk_rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
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
