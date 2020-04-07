<script>
import { Article, columns } from "../../../service/model/Article";
import toolBar from "../../../components/toolBar/index";
const article = new Article("articles");
export default {
  name: "articles",
  components: {
    toolBar
  },
  data() {
    return {
      //table数据源
      data: [],
      //table列头配置
      columns,
      //标题
      title: "文章列表",
      //是否正在加载
      loading: true,
      //分页配置
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100", "1000"],
        showTotal: total => `共有 ${total} 条数据`,
        showQuickJumper: true
      },
      scroll: { x: 1500, y: 0 }
    };
  },
  methods: {
    //初始化表格数据
    async fetchData(req) {
      this.loading = true;
      await article
        .getList(req)
        .then(res => {
          this.data = res;
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //删除接口
    async deleteData(id) {
      this.loading = true;
      await article
        .delete(id)
        .then(res => {
          this.fetchData();
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //增加按钮点击事件
    handleAdd() {
      this.$router.push("/article/create");
    },
    //删除按钮点击事件
    handleDelete(id) {
      this.deleteData(id);
    },
    //编辑按钮点击事件
    handleEdit(id) {
      this.$router.push("/article/edit/" + id);
    },
    handleSearch(req) {
      this.fetchData({ key: req });
    }
  },
  created() {
    this.fetchData();
  },
  render() {
    return (
      <div>
        <toolBar
          addButtonOption={this.handleAdd}
          onHandleSearch={this.handleSearch}
        />
        <a-table
          columns={this.columns}
          dataSource={this.data}
          loading={this.loading}
          pagination={this.pagination}
          rowKey={record => record._id}
          scroll={this.scroll}
          {...{
            scopedSlots: {
              action: value => {
                return (
                  <div>
                    <a-button
                      type="primary"
                      icon={"edit"}
                      onClick={() => {
                        this.handleEdit(value._id);
                      }}
                    >
                      编辑
                    </a-button>
                    <a-divider type="vertical" />
                    <a-popconfirm
                      title="确定要删除该文章吗?"
                      onConfirm={() => this.handleDelete(value._id)}
                    >
                      <a-button icon={"delete"}>删除</a-button>
                    </a-popconfirm>
                  </div>
                );
              },
              tags: data => {
                return data.tags.map(item => {
                  return (
                    <a-tag
                      key={item._id}
                      onClick={() => {
                        this.$router.push("/tag/list");
                      }}
                    >
                      {item.title}
                    </a-tag>
                  );
                });
              },
              banner: data => {
                return <img src={data.banner} style={"height:70px"} />;
              },
              title: data => {
                return (
                  <div
                    style={
                      "height:30px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;"
                    }
                    title={data.title}
                  >
                    {data.title}
                  </div>
                );
              },
              description: data => {
                return (
                  <div
                    style={
                      "line-height:1.5;height:80px;width:300px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 4;overflow: hidden;"
                    }
                    title={data.description}
                  >
                    {data.description}
                  </div>
                );
              },
              created: data => {
                return (
                  <div>
                    {this.$moment(data.created).format("YYYY-MM-DD HH:mm:ss")}
                  </div>
                );
              },
              updated: data => {
                return (
                  <div>
                    {this.$moment(data.updated).format("YYYY-MM-DD HH:mm:ss")}
                  </div>
                );
              }
            }
          }}
        ></a-table>
      </div>
    );
  }
};
</script>
