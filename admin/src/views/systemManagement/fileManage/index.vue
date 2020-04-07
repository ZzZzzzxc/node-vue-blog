<script>
import { File, columns } from "../../../service/model/File";
let qiniu = new File();
export default {
  name: "file",
  data() {
    return {
      tabsOptions: {
        defaultActiveKey: "all",
        activeKey: "all",
        tabs: [
          {
            title: "全部",
            key: "all"
          },
          {
            title: "图像",
            key: "image"
          },
          {
            title: "音频",
            key: "audio"
          },
          {
            title: "Markdown文件",
            key: "md"
          },
          {
            title: "Lrc歌词文件",
            key: "lrc"
          }
        ]
      },
      listData: [],
      loading: true,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100", "1000"],
        showTotal: total => `共有 ${total} 条数据`,
        showQuickJumper: true
      },
      typeMap: ["普通存储", "低频存储","归档存储"],
      cdn: "https://cdn.zhangxc.cn/"
    };
  },
  methods: {
    fetchListData(activeKey) {
      this.loading = true;
      qiniu
        .getQiniuFileList(activeKey)
        .then(res => {
          this.listData = res.items;
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    tabsChange(activeKey) {
      this.tabsOptions.activeKey = activeKey;
      this.fetchListData(this.tabsOptions.activeKey);
    },
    renderTable() {
      return (
        <div>
          <a-table
            columns={columns}
            rowKey={record => record.key}
            dataSource={this.listData}
            pagination={this.pagination}
            loading={this.loading}
            {...{
              scopedSlots: {
                fsize: value => {
                  return <div>{(value / 1024).toFixed(2)} kb</div>;
                },
                type: value => {
                  return <div>{this.typeMap[value]}</div>;
                },
                content: value => {
                  return (
                    <a href={this.cdn + value} target={value}>
                      {value}
                    </a>
                  );
                },
                putTime: value => {
                  return (
                    <div>
                      {this.$moment
                        .unix(value / 10000000)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                  );
                },
                action: value => {
                  return (
                    <div>
                      <a-popconfirm title="确定要删除该项吗?">
                        <a-button icon={"delete"}>删除</a-button>
                      </a-popconfirm>
                    </div>
                  );
                }
              }
            }}
          ></a-table>
        </div>
      );
    }
  },
  created() {
    this.fetchListData(this.tabsOptions.defaultActiveKey);
  },
  render() {
    return (
      <div>
        <a-tabs
          defaultActiveKey={this.tabsOptions.defaultActiveKey}
          onChange={this.tabsChange}
        >
          {this.tabsOptions.tabs.map(item => {
            return (
              <a-tab-pane tab={item.title} key={item.key}>
                {this.renderTable()}
              </a-tab-pane>
            );
          })}
        </a-tabs>
      </div>
    );
  }
};
</script>
<style lang="less" scoped></style>
