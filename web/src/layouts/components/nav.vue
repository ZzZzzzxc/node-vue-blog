<script>
import { getNavList, getLogo } from "../../services/index";
import "../../style/nav.less";
export default {
  name: "header-nav",
  data() {
    return {
      //页面滚动距离
      scrollTop: 0,
      //窗口宽度
      screenWidth:
        document.documentElement.clientWidth || document.body.clientWidth,
      //导航栏数据源
      itemList: [],
      //导航栏是否显示
      isVisible: false,
      //侧栏是否打开
      isSlideShow: false,
      current: "",
      logo: {}
    };
  },
  watch: {
    //根据滚动距离对Nav进行处理
    scrollTop(val, oldVal) {
      //当向下滚动且滚动距离超过200时
      if (val > 50 && val > oldVal) {
        this.$refs.nav.style.marginTop = "-6rem";
        this.isSlideShow = false;
      }
      //当向上滚动且滚动距离小于200时
      else if (val < 50 && val < oldVal) {
        this.$refs.nav.style.background = "rgba(138, 86, 86, 0)";
        this.isSlideShow = false;
      }
      //当向上滚动且滚动距离大于200时
      else if (val > 50 && val < oldVal) {
        this.$refs.nav.style.marginTop = "0";
        this.$refs.nav.style.background = "white";
        this.isSlideShow = false;
      }
    },
    //监听窗口宽度
    screenWidth(val, oldVal) {
      val > 979 ? (this.isVisible = true) : (this.isVisible = false);
    },
    //
    isSlideShow(val, oldVal) {
      if (val) {
        this.$refs.slide.style.right = "0";
      } else {
        this.$refs.slide.style.right = "-400px";
      }
    },
    "$route.path": function(newVal, oldVal) {
      this.isSlideShow = false;
    }
  },
  methods: {
    switch() {
      this.isSlideShow = !this.isSlideShow;
    },
    fetchListData() {
      getNavList()
        .then(res => {
          this.itemList = res;
        })
        .catch(err => {
          this.$Message.info({ content: err });
        });
      getLogo()
        .then(res => {
          this.logo = res[res.length-1];
        })
        .catch(err => {
          this.$Message.info({ content: err });
        });
    },
    toPage(data) {
      this.current = data.path;
      this.$router.push({
        path: "/" + data.path
      });
      this.isSlideShow = false;
    }
  },
  created() {
    this.fetchListData();
    this.current = this.$route.path.split("/")[1];
  },
  mounted() {
    let self = this;
    this.screenWidth > 979 ? (this.isVisible = true) : (this.isVisible = false);
    window.onresize = function() {
      self.screenWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
    };
    window.addEventListener("scroll", () => {
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    });
  },
  render() {
    return (
      <div>
        <header id="nav-body" ref="nav">
          <div class="container">
            <div id="logo">{
              this.logo.isUse&&this.logo.banner?<img src={this.logo.banner} />:this.logo.title
            }</div>
            <span id="open-btn" onClick={() => this.switch()}>
              {this.isSlideShow ? "" : <svg-icon iconClass="list" />}
            </span>
            <ul id="nav-menu">
              {this.isVisible ? (
                this.itemList.map(item => {
                  return (
                    <li
                      onClick={() => {
                        this.toPage(item);
                      }}
                      class={this.current == item.path ? "active" : ""}
                    >
                      <span>{item.title}</span>
                    </li>
                  );
                })
              ) : (
                <div />
              )}
            </ul>
          </div>
        </header>

        <ul id="nav-menu-slide" ref="slide">
          {this.itemList.map(item => {
            return (
              <li
                onClick={() => {
                  this.toPage(item);
                }}
                key={item._id}
              >
                <span>{item.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};
</script>
