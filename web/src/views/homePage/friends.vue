<script>
import { getFriendLink } from "../../services/index";
import valineComment from "../../components/valineComment/index";
export default {
  name: "friend",
  data() {
    return {
      dataJson: []
    };
  },
  created() {
    getFriendLink()
      .then(res => {
        this.dataJson = res;
      })
      .catch(err => {
        this.$Message.info({ content: err });
      });
  },
  render() {
    return (
      <div class="friend-content">
        <h1 class="title">
          <a id="友链">友链</a>
        </h1>
        {this.dataJson.map(item => {
          return (
            <p>
              <span
                class="avatar"
                style={"background-image:url(" + item.avatar + ")"}
              />
              <a href={item.url} target={item._id}>{item.title}</a>
              {"————" + item.description}
            </p>
          );
        })}
        <valineComment />
      </div>
    );
  }
};
</script>
<style lang="less" scoped>
.friend-content {
  max-width: 60rem;
  margin: 0 auto;
  padding: 15px 25px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  .title {
    font-weight: bolder;
    font-size: 20px;
  }

  p {
    max-width: 100%;
    list-style: none;
    border-bottom: 1px dashed #9a9c9d;
    font-size: 1rem;
    margin-bottom: 3px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    .avatar {
      width: 23px;
      height: 23px;
      display: inline-block;
      background-size: cover !important;
      vertical-align: middle;
    }
    a {
      text-decoration: underline;
      cursor: pointer;
      color: #0cddf8;
    }
  }
}
</style>
