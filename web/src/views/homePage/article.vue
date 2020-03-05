<script>
import { getArticleDetail } from "../../services/index";
import catalogTree from "../../components/catalogTree/index";
import valineComment from "../../components/valineComment/index";
import "../../style/article.less";
import "../../style/markdown.less";
export default {
  name: "article-detail",
  data() {
    return {
      dataJson: {
        tags: []
      },
      titleOffsetTop: []
    };
  },
  created() {
    getArticleDetail(this.$route.params.id)
      .then(res => {
        this.dataJson = res;
        this.$nextTick(this.getOffsetTopList);
      })
      .catch(err => {
        this.$Message.info({ content: err });
      });
  },
  mounted() {
    this.imgZooms();
  },
  methods: {
    getOffsetTopList() {
      const tag_lst = ["H1", "H2", "H3", "H4", "H5", "H6"];
      const doc_list = document.getElementsByClassName("post_detail")[0]
        .children;
      for (let i = 0; i < doc_list.length; i++) {
        if (tag_lst.indexOf(doc_list[i].tagName) >= 0) {
          this.titleOffsetTop.push(doc_list[i].offsetTop);
        }
      }
    },
    imgZooms() {
      let blog = document.getElementsByClassName("markdown-body")[0];
      let zooms = document.getElementById("zooms");
      let zoomsImg = this.$refs.zoomsImg;
      let target = "";
      blog.addEventListener("click", ev => {
        let eve = ev || window.event;
        target = eve.target || eve.srcElement;
        if (target.nodeName.toLowerCase() === "img") {
          zoomsImg.src = target.src;
          zooms.style.visibility = "visible";
          zooms.style.opacity = "1";
        }
      });
      zooms.addEventListener("click", ev => {
        zooms.style.visibility = "hidden";
        zooms.style.opacity = "0";
      });
    }
  },
  render() {
    const directives = [
      { name: "lazy", value: this.dataJson.banner, arg: "background-image" }
    ];
    return (
      <div class="article-page">
        <div class="header container">
          <div class="title">{this.dataJson.title}</div>
          <div class="time">
            <div>
              第一次发表于
              {this.$moment(this.dataJson.created).format("YYYY/MM/DD ")}
            </div>
            <div>
              最后编辑于
              {this.$moment(this.dataJson.updated).format("YYYY/MM/DD ")}
            </div>
          </div>
          <div class="description">{this.dataJson.description}</div>
          <div class="tagList">
            {this.dataJson.tags.map(item => {
              return <div class="tag">{item.title}</div>;
            })}
          </div>
        </div>
        <div class="banner-box container">
          <div class="banner" {...{ directives }} />
        </div>
        <div class="container content">
          <article
            domPropsInnerHTML={this.dataJson.contextHtml}
            class="post_detail markdown-body"
          />
          <valineComment />
        </div>
        {Array.prototype.concat.apply([], this.dataJson.catalog).length > 0 ? (
          <catalogTree
            catalogData={this.dataJson.catalog}
            titleOffsetTop={this.titleOffsetTop}
          />
        ) : null}
        <div id="zooms">
          <img
            ref="zoomsImg"
            src={"http://cdn.zhangxc.cn/FqFWBFlRmVB-cbLmrQ_7jOcXmgx-"}
          />
        </div>
      </div>
    );
  }
};
</script>
