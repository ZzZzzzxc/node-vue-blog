<script>
import { getAboutMe } from "../../services/index";
import catalogTree from "../../components/catalogTree/index";
import "../../style/article.less";
import '../../style/markdown.less'
import valineComment from "../../components/valineComment/index";
export default {
  name: "about-me",
  data() {
    return {
      dataJson: {
        tags: []
      },
      titleOffsetTop: []
    };
  },
  created() {
    getAboutMe()
      .then(res => {
        this.dataJson = res;
        this.$nextTick(this.getOffsetTopList);
      })
      .catch(err => {
        this.$Message.info({ content: err });
      });
  },
  methods: {
    getOffsetTopList() {
      const tag_lst = ["H1"];
      const doc_list = document.getElementsByClassName("post_detail")[0]
        .children;
      for (let i = 0; i < doc_list.length; i++) {
        if (tag_lst.indexOf(doc_list[i].tagName) >= 0) {
          this.titleOffsetTop.push(doc_list[i].offsetTop);
        }
      }
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
      </div>
    );
  }
};
</script>
