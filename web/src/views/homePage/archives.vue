<script>
import "../../style/archives.less";
import {
  getTagList,
  getArticlesByTag,
  getArticlesList
} from "../../services/index";
import { debounce } from "../../utils/index";
export default {
  name: "archive",
  data() {
    return {
      tagList: [],
      articleList: [],
      current: "全部",
      loading: true
    };
  },
  components: {},
  methods: {
    findArticleByTag(id) {
      this.loading = true;
      this.articleList = [];
      if (id) {
        this.current = id;
        getArticlesByTag(id)
          .then(res => {
            this.articleList = res[0].articlesList;
          })
          .catch(err => this.$Message.info({ content: err }))
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.current = "全部";
        getArticlesList()
          .then(res => {
            this.articleList = res;
          })
          .catch(err => this.$Message.info({ content: err }))
          .finally(() => {
            this.loading = false;
          });
      }
    },
    toArticleDetail(id) {
      this.$router.push("article/" + id);
    }
  },
  created() {
    getTagList()
      .then(res => {
        this.tagList = res;
      })
      .catch(err => {
        this.$Message.info({ content: err });
      });
    this.findArticleByTag();
  },
  render() {
    return (
      <div class="archive-container container">
        <div class="tag-list">
          <div
            onClick={() => this.findArticleByTag()}
            class={this.current == "全部" ? "tag active" : "tag"}
          >
            全部
          </div>
          {this.tagList.map(item => {
            return (
              <div
                class={this.current == item._id ? "tag active" : "tag"}
                onClick={() => this.findArticleByTag(item._id)}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        <div class="article-info">共有{this.articleList.length}篇文章</div>
        <div class="article-list ">
          {this.loading ? (
            <span>正在加载...</span>
          ) : (
            <transition name="fade">
              <div>
              {this.articleList.map(item => {
                return (
                  <div
                    key={item._id}
                    class="article"
                    onClick={() => {
                      this.toArticleDetail(item._id);
                    }}
                  >
                    <img class="item" src={item.banner} />
                    <div class="item">{item.title}</div>
                    <div class="item">💕💕💕</div>
                    <div class="item">
                      {this.$moment(item.created).format("YYYY/MM/DD ")}
                    </div>
                  </div>
                );
              })}
              </div>
            </transition>
          )}
        </div>
      </div>
    );
  }
};
</script>
