<script>
export default {
  name: "article-card",
  props: {
    id: String,
    imgUrl: String,
    title: String,
    description: String,
    tags: Array,
    nums: Number,
    updated: {
      type: String,
      default: "暂无修改"
    },
    created: String
  },
  data() {
    return {};
  },
  methods: {
    toDetail() {
      this.$nextTick(() => {
        this.$router.push("/article/" + this.id);
      });
    },
  },
  render() {
    // 图片懒加载配置
    const directives = [
      { name: "lazy", value: this.imgUrl, arg: "background-image" }
    ];
    return (
      <div class="card-body" onClick={this.toDetail}>
        <div class="card-header">
          <div class="bg" {...{ directives }} />
          <div class="list-box">
            <div class="list-title">
              <svg-icon iconClass={"tag"} />
            </div>
            <div class="tag-list">
              {this.tags.map(item => (
                <div
                  class="tag"
                  title={item.title}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div class="card-content">
          <div class="title" title={this.title}>
            {this.title}
          </div>
          <transition name="fade">
            <article class="article" title={this.description}>
              {this.description}
            </article>
          </transition>
        </div>
        <div class="card-footer">
          <div class="basic-msg-list">
            <div class="msg" title="发布时间">
              <svg-icon iconClass={"date"} />
              {this.$moment(this.created).format("YYYY/MM/DD ")}
            </div>
            <div class="msg" title="点击数">
              <svg-icon iconClass={"eye"} />
              {this.nums ? this.nums : 0}
            </div>
            <div class="msg" title="评论数">
              <svg-icon iconClass={"comment"} />
              {0}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
</script>
<style lang="less" scoped>
.card-body {
  cursor: pointer;
  height: 480px;
  width: 260px;
  box-shadow: 1px 1px 3px #9a9c9d;
  margin: 0 auto;
  border-radius: 20px;
  transition: all 0.4s ease-in-out;
  padding: 10px 0;
  .card-header {
    height: 330px;
    border-bottom: 1px dashed #b7b7b7;
    transition: all 0.4s ease-in-out;
    position: relative;
    .bg {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      box-shadow: 1px 1px 2px #9a9c9d;
      margin: 0 auto;
      opacity: 0.86;
      transition: all 0.4s ease-in-out;
      margin-top: -40px;
    }
    .list-box {
      position: absolute;
      width: 100%;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      .list-title {
        transition: all 0.4s ease-in-out;
        margin: 0 auto;
        text-align: center;
        font-size: 21px;
        height: 30px;
        width: 30px;
        line-height: 30px;
        border-radius: 50%;
        border-bottom: 1px solid #b7b7b7;
      }
      .tag-list {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 10px 0;
        .tag {
          display: inline-block;
          max-width: 100%;
          height: 24px;
          margin: 3px 5px;
          line-height: 24px;
          border-radius: 4px;
          background: #eee;
          font-size: 12px;
          color: #333;
          cursor: pointer;
          transition: 0.2s;
          padding: 0 10px;
        }
      }
    }
  }
  .card-content {
    height: 140px;
    transition: all 0.4s ease-in-out;
    overflow: hidden;
    font-size: 15px;
    .title {
      text-align: center;
      height: 40px;
      line-height: 40px;
      padding: 15px 20px;
      transition: all 0.4s ease-in-out;
    }
    .article {
      text-align: center;
      height: 0;
      opacity: 0;
      padding: 0 20px;
      transition: all 0.4s ease-in-out;
    }
  }
  .card-footer {
    height: 30px;
    border-top: 1px dashed #b7b7b7;
    transition: all 0.4s ease-in-out;
    font-size: 14px;
    .basic-msg-list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      margin: 10px 0;
      .msg {
        margin: 0 10px;
      }
    }
  }
}
.card-body:hover {
  box-shadow: 2px 2px 5px #9a9c9d;
  .card-header {
    height: 220px;
    .list-title {
      margin: 0 auto;
      text-align: center;
      font-size: 21px;
      height: 30px;
      width: 30px;
      line-height: 30px;
      border: none;
      border-bottom: 2px solid #b7b7b7;
      border-radius: 0;
    }
    .bg {
      width: 100px;
      height: 100px;
      opacity: 1;
      filter: drop-shadow(2px 4px 6px #a2b7b87e);
    }
  }
  .card-content {
    height: 250px;
    .title {
      height: 0;
      opacity: 0;
    }
    .article {
      height: 100%;

      opacity: 1;
    }
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
