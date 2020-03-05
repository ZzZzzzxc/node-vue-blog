<script>
import { getArticleDetail } from "../../services/index";
import "./catalogTree.less";
import node from "./node";
export default {
  name: "catalogTree",
  props: {
    catalogData: Array,
    titleOffsetTop: Array
  },
  data() {
    return {
      activeIndex: -1
    };
  },
  methods: {
    onScroll() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      for (let i = 0; i < this.titleOffsetTop.length; i++) {
        if (scrollTop >= this.titleOffsetTop[i] - 20) {
          this.activeIndex = i;
        }
      }
      this.autoScroll();
    },
    autoScroll() {
      let distance = this.activeIndex * 32 + 32 - this.$refs.tree.scrollTop;
      if (distance > 320) {
        this.$refs.tree.scrollTop += 40;
      }
      if (distance < 100) {
        this.$refs.tree.scrollTop -= 40;
      }
    }
  },
  components: { node },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  destroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  render() {
    return (
      <div class="catalog-tree" ref="tree">
        <transition name="fade">
          <node
            treeData={this.catalogData}
            activeIndex={this.activeIndex}
            titleOffsetTop={this.titleOffsetTop}
          />
        </transition>
      </div>
    );
  }
};
</script>
