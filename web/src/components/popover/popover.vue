<template>
  <div class="popover">
    <div class="popover-toggle " @click.stop="pop($event)">
      <slot name="toggle"></slot>
    </div>
    <div
      class="popover-wrap"
      :style="{
        left: x + 'px',
        top: y + 'px',
        visibility: show ? 'visible' : 'hidden'
      }"
      ref="pop"
    >
      <div class="popover-box" :style="{ width: `${width}px` }">
        <div class="popover-title">
          {{ title }}
          <div class="popover-close" @click="close">x</div>
        </div>
        <div class="popover-content" v-if="content">{{ content }}</div>
        <div v-else>
          <slot name="content"></slot>
        </div>
        <div class="popover-footer">
          <slot name="footer"></slot>
        </div>
        <div
          v-if="position == 'topLeft' || position == 'bottomLeft'"
          :class="[
            'popover-arrow',
            position == 'topLeft' || position == 'topRight'
              ? 'popover-arrow-top'
              : 'popover-arrow-bottom'
          ]"
          :style="{ right: arrowLeft + 'px' }"
        ></div>
        <div
          v-if="position == 'topRight' || position == 'bottomRight'"
          :class="[
            'popover-arrow',
            position == 'topLeft' || position == 'topRight'
              ? 'popover-arrow-top'
              : 'popover-arrow-bottom'
          ]"
          :style="{ left: arrowLeft + 'px' }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
const TAGNAME = ["svg", "use"];
export default {
  props: {
    width: {
      type: Number,
      default: 200
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    position: {
      type: String,
      default: "topRight",
      validator(value) {
        return (
          ["topLeft", "topRight", "bottomLeft", "bottomRight"].indexOf(
            value
          ) !== -1
        );
      }
    }
  },
  data() {
    return {
      show: false,
      arrowLeft: 0,
      x: 0,
      y: 0
    };
  },
  methods: {
    close() {
      this.show = false;
    },
    checkTag(tagName) {
      return TAGNAME.includes(tagName);
    },
    pop(e) {
      if (this.show) {
        this.show = false;
        return;
      }
      let target = e.target;
      // 判断点击的元素是不是svg
      while (this.checkTag(target.tagName)) {
        if (target.parentNode) {
          target = target.parentNode;
        } else {
          break;
        }
      }
      this.arrowLeft = target.offsetWidth / 2;
      switch (this.position) {
        case "topLeft":
            console.log(target.offsetLeft)
          this.x = target.offsetLeft;
          this.y = target.offsetTop - this.$refs["pop"].offsetHeight - 3;
          break;
        case "topRight":
          this.x = target.offsetLeft;
          this.y = target.offsetTop - this.$refs["pop"].offsetHeight - 3;
          break;
        case "bottomLeft":
          this.x = target.offsetRight;
          this.y = target.offsetTop + target.offsetHeight + 3;
          break;
        case "bottomRight":
          this.x = target.offsetLeft;
          this.y = target.offsetTop + target.offsetHeight + 3;
          break;
      }
      this.show = true;
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.popover {
  z-index: 999;
  .popover-toggle {
    display: inline-block;
  }
  .popover-wrap {
    position: absolute;
    .popover-box {
      box-sizing: border-box;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      box-shadow: 0 1px 6px hsla(0, 0%, 39%, 0.2);
      position: relative;
      .popover-title {
        padding: 0 16px;
        line-height: 32px;
        height: 32px;
        border-bottom: 1px solid #e9e9e9;
        color: #666;
        overflow: hidden;
        .popover-close {
          float: right;
          font-size: 16px;
          font-weight: bolder;
          cursor: pointer;
          user-select: none;
        }
      }
      .popover-content {
        padding: 8px 16px;
        color: #666;
        word-break: break-all;
      }
      .popover-footer {
        padding: 0 16px;
        line-height: 32px;
        height: 22px;
        border-top: 1px solid #e9e9e9;
        color: #666;
      }
      .popover-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        margin-left: -5px;
        &:after {
          content: " ";
          margin-left: -4px;
          border: 4px solid transparent;
          position: absolute;
          width: 0;
          height: 0;
        }
      }
      .popover-arrow-top {
        border-bottom-width: 0;
        border-top-color: #d9d9d9;
        bottom: -5px;
        &:after {
          border-top-color: #fff;
          bottom: -3px;
        }
      }
      .popover-arrow-bottom {
        border-top-width: 0;
        border-bottom-color: #d9d9d9;
        top: -5px;
        &:after {
          border-bottom-color: #fff;
          top: -3px;
        }
      }
    }
  }
}
</style>
