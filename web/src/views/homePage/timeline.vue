<script>
import { getArticlesByYear } from "../../services/index";
export default {
  name: "timeline",
  data() {
    return {
      startYear: 2010,
      endYear: new Date().getFullYear(),
      dataJson: {}
    };
  },
  computed: {
    range() {
      let res = [];
      while (this.startYear <= this.endYear) {
        res.unshift(this.startYear);
        this.$set(this.dataJson, this.startYear, []);
        this.fetchListData(this.startYear);
        this.startYear++;
      }
      console.log(this.dataJson);
      return res;
    }
  },
  methods: {
    fetchListData(year) {
      getArticlesByYear(year)
        .then(res => {
          this.$set(this.dataJson, year, res);
        })
        .catch(err => {
          this.$Message.info({ content: err });
        });
    },
    toTarget(id){
        window.open(`https://blog.zhangxc.cn/article/${id}`);
    }
  },
  render() {
    return (
      <div class="timeline-container">
        {this.range.map(year => {
          return this.dataJson[year].length ? (
            <div>
              <div class="year">{year}</div>
              {this.dataJson[year].map(item => {
                return (
                  <div class="timeline-item">
                    <div class="image">
                      <div>
                        <img src={item.banner} />
                        <span>
                          {this.$moment(item.created).format("YYYY-MM-DD")}
                        </span>
                      </div>
                    </div>
                    <div class="details" onClick={()=>{this.toTarget(item._id)}}>
                      <div>
                        <h1> {item.title}</h1>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null;
        })}
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.timeline-container {
  .year {
    width: 80%;
    margin: 0 auto;
    font-size: 24px;
    font-weight: bolder;
  }
  .timeline-item {
    display: flex;
    width: 80%;
    margin: 0 auto;
    .image {
      padding: 1em 2em;
    }
    .image > div {
      position: relative;
      text-align: center;
      font-size: 0.8em;
    }
    .image > div::after {
      content: "";
      width: 100%;
      height: 0;
      border-bottom: 1px solid #ffac5a;
      position: absolute;
      top: 2.75em;
      left: 2.5em;
      z-index: -1;
    }
    .image img {
      max-height: 5em;
      max-width: 5em;
      border: 1px solid #ffac5a;
    }
    .image span {
      display: block;
      clear: both;
      padding: 0.25em 0;
      margin: 0.5em 0;
    }
    .details {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex-positive: 1;
      flex-grow: 1;
      cursor: pointer;

      & > div {
        border: 2px solid #ffac5a;
        border-radius: 0.5em;
        padding: 1.5em;
        margin: 1em 0;
        transition: 0.3s;
        &:hover {
          background: #ffac5a;
          color:#fff;
        }
        h1 {  
          font-size: 1.4em;
          margin: 0;
          padding: 0 0 0.5em 0;
          letter-spacing: 0.1em;
        }
        p {
          margin: 0;
          padding: 0;
          line-height: 150%;
        }
      }
      &::before {
        content: "";
        width: 0;
        height: 100%;
        border-left: 1px solid #ffac5a;
        position: absolute;
        top: 0;
        left: -4.35em;
        z-index: -1;
      }
    }
  }
}
</style>
