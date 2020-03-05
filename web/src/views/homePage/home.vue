<template>
  <div class="container">
    <transition-group name="fade" class="flex-box">
      <div class="flex-item" v-for="item in articleList" :key="item._id">
        <articleCard
          :id="item._id"
          :imgUrl="item.banner"
          :title="item.title"
          :description="item.description"
          :tags="item.tags"
          :created="item.created"
          :updated="item.updated"
          :nums="item.nums"
          :key="item._id"
        ></articleCard></div
    ></transition-group>
    <div class="tip">
      <div v-if="isEnd">已经翻到底了/(ㄒoㄒ)/~~</div>
      <div v-if="loading">
        正在拼命加载，请稍后...
      </div>
      <div v-if="!isEnd&&!isloading">
        滚动加载
      </div>
    </div>
  </div>
</template>

<script>
import articleCard from "../viewsComponents/articleCard";
import { getArticlesList } from "../../services/index";
export default {
  name: "home",
  data() {
    return {
      articleList: [],
      //页面是否加载完成
      isEnd: false,
      //每页条数
      page: 5,
      //当前页
      current: 0,
      //页面滚动距离
      scrollTop: 0,
      //正在加载
      loading: true
    };
  },
  components: { articleCard },
  watch: {
    scrollTop(val, oldVal) {
      if (val < this.loadHref) {
        this.loadMore();
      }
    },
    isEnd(val) {
      if (val) {
        this.$Message.info({ content: "已经翻到底了/(ㄒoㄒ)/~~" });
      }
    }
  },
  computed: {
    //距离底部多少触发加载
    loadHref() {
      return window.screen.height;
    }
  },
  methods: {
    fetchListData() {
      this.loading = true;
      getArticlesList({ page: this.page, current: this.current })
        .then(res => {
          res.length ? this.articleList.push(...res) : (this.isEnd = true);
        })
        .catch(err => {
          this.$Message.info({ content: err });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadMore() {
      if (!this.isEnd && !this.loading) {
        this.current++;
        this.fetchListData();
      }
    },
    scrollAction() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.body.scrollHeight;
      this.scrollTop = scrollHeight - scrollTop;
    }
  },

  created() {
    this.fetchListData();
  },
  mounted() {
    window.addEventListener("scroll", this.scrollAction);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollAction);
  }
};
</script>

<style scoped>
.flex-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: space-between;
}
@media (min-width: 1000px) {
  .flex-item {
    width: 33%;
    margin: 40px 0;
  }
}

@media (max-width: 1000px) and (min-width: 700px) {
  .flex-item {
    width: 50%;
    margin: 40px 0;
  }
}
@media (max-width: 690px) {
  .flex-item {
    width: 100%;
    margin: 40px 0;
  }
}

.tip {
  text-align: center;
  margin-top: 100px;
  font-size: 16px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter {
  opacity: 0;
  transform: translateY(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
