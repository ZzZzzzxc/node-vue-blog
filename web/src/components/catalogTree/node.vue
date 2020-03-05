<script>
import { scroll } from "./scrollTo";
const deepMap = ["", "d-1", "d-2", "d-3", "d-4", "d-5", "d-6"];
export default {
  name: "node",
  props: {
    treeData: null,
    activeIndex: {
      default: -1,
      type: Number
    }
  },
  mixins: [scroll],
  methods: {
    scrollTo(id) {
      let top = document.getElementById(id).getBoundingClientRect().top;
      top += document.body.scrollTop || document.documentElement.scrollTop;
      this.scrollToTarget(top);
    }
  },
  render() {
    return (
      <div class="node">
        {this.treeData
          ? this.treeData.map((child, index) => {
              return (
                <div class={deepMap[child.deep]}>
                  <div
                    title={child.title}
                    onClick={() => {
                      this.scrollTo(child.id);
                    }}
                    class={
                      this.activeIndex == child.index ? "active item" : "item"
                    }
                  >
                    {child.tag + child.title}
                  </div>
                  {child.children ? (
                    <node
                      treeData={child.children}
                      activeIndex={this.activeIndex}
                    />
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
    );
  }
};
</script>

<style lang="less" scoped></style>
