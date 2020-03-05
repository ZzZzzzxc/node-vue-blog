<script>
import { Music, columns } from "../../service/model/Music";
import toolBar from "../../components/toolBar/index";
const musics = new Music("musics");
export default {
  name: "musicList",
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
      title: "歌曲列表",
      //是否正在加载
      loading: true,
      //modal是否可见
      visible: false,
      //antd表单创建
      form: this.$form.createForm(this),
      //分页配置
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100", "1000"],
        showTotal: total => `共有 ${total} 条数据`,
        showQuickJumper: true
      },
      //url
      resourceUrl: null,
      uploading: false,
      //modal状态（新增 or 编辑）
      modalType: "create" || "edit"
    };
  },
  methods: {
    //初始化表格数据
    async fetchData(req) {
      this.loading = true;
      let res = await musics.getList(req);
      this.data = res;
      this.loading = false;
    },
    //新增接口
    async postData(values) {
      this.loading = true;
      let res = await musics.post(values);
      this.loading = false;
      this.fetchData();
      this.$message.success("添加歌曲成功");
    },
    //删除接口
    async deleteData(id) {
      this.loading = true;
      let res = await musics.delete(id);
      this.loading = false;
      this.fetchData();
    },
    //获取单条数据接口
    async getDataById(id) {
      let res = await musics.getById(id);
      this.resourceUrl = res.url;
      this.form.setFieldsValue({
        _id: res._id,
        url: res.url,
        title: res.title,
        singer: res.singer
      });
    },
    //修改接口
    async putData(id, values) {
      this.loading = true;
      let res = await musics.put(id, values);
      this.loading = false;
      this.fetchData();
      this.$message.success("修改歌曲成功");
    },
    //modal保存事件
    handleSave(id) {
      if (this.modalType == "create") {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.postData(values);
            this.handleCancle();
          }
        });
      } else if (this.modalType == "edit") {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.putData(id, values);
            this.handleCancle();
          }
        });
      }
    },
    //增加按钮点击事件
    handleAdd() {
      this.modalType = "create";
      this.visible = true;
    },
    //modal取消按钮点击事件
    handleCancle() {
      this.visible = false;
      this.form.resetFields();
      this.resourceUrl = null;
    },
    //删除按钮点击事件
    handleDelete(id) {
      this.deleteData(id);
    },
    //编辑按钮点击事件
    handleEdit(id) {
      this.modalType = "edit";
      this.visible = true;
      this.getDataById(id);
    },
    //搜索
    handleSearch(req) {
      this.fetchData({ key: req });
    },
    handleUpload(data) {
      this.upload(data);
    },
    async upload(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      // const res = await musics.upload(formData);
      await musics
        .uploadByQiniu(formData)
        .then(res => {
          console.log('成功获取token')
          formData.append("token", res.uploadToken);
          this.$http.post("https://up-z2.qiniup.com/", formData).then(res => {
            this.resourceUrl = res.url;
            this.form.setFieldsValue({
              url: res.url
            });
          });
        })
        .catch(err => { console.log('未能成功获取token')})
        .finally(() => {
          this.uploading = false;
        });

      // this.uploading = false;
      // this.resourceUrl = res.url;
      // this.form.setFieldsValue({
      //   url: res.url
      // });
    },
    beforeUpload(file) {
      this.uploading = true;
      const isJPG = file.type === "audio/mp3";
      if (!isJPG) {
        this.$message.error("请上传mp3文件");
      }
      const isLt2M = file.size / 1024 / 1024 < 30;
      if (!isLt2M) {
        this.$message.error("音频不能超过30M");
      }
      this.uploading = false;
      return isJPG && isLt2M;
    },
    rendermodalForm() {
      return (
        <a-modal
          visible={this.visible}
          title={this.modalType == "create" ? "新增" : "编辑"}
          okText="保存"
          onCancel={this.handleCancle}
          onOk={() => {
            this.handleSave(this.form.getFieldValue("_id"));
          }}
        >
          <a-form form={this.form}>
            {this.modalType == "edit" ? (
              <a-form-item label="_id">
                <a-input
                  disabled={true}
                  v-decorator={[
                    "_id",
                    {
                      rules: [{ required: true }]
                    }
                  ]}
                />
              </a-form-item>
            ) : null}
            <a-form-item label="url">
              <div
                v-decorator={[
                  "url",
                  {
                    rules: [{ required: true, message: "记得上传资源" }]
                  }
                ]}
              >
                {typeof this.resourceUrl == "string" ? (
                  <div>{this.resourceUrl}</div>
                ) : (
                  <a-upload
                    customRequest={this.handleUpload}
                    multiple={false}
                    beforeUpload={this.beforeUpload}
                    showUploadList={false}
                    onChange={() => {}}
                  >
                    <a-button>
                      <a-icon type="upload" />
                      Upload
                    </a-button>
                  </a-upload>
                )}
              </div>
            </a-form-item>
            <a-form-item label="歌名">
              <a-input
                placeholder="请输入歌名"
                v-decorator={[
                  "title",
                  {
                    rules: [{ required: true, message: "请输入歌名" }]
                  }
                ]}
              />
            </a-form-item>
            <a-form-item label="歌手名">
              <a-input
                placeholder="请输入歌手名"
                v-decorator={[
                  "singer",
                  {
                    rules: [{ required: true, message: "请输入歌手名" }]
                  }
                ]}
              />
            </a-form-item>
          </a-form>
        </a-modal>
      );
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
          size={"small"}
          {...{
            scopedSlots: {
              action: value => {
                return (
                  <div>
                    <a-button
                      type="primary"
                      icon={"edit"}
                      onClick={() => this.handleEdit(value._id)}
                    >
                      编辑
                    </a-button>

                    <a-divider type="vertical" />
                    <a-popconfirm
                      title="确定要删除该标签吗?"
                      onConfirm={() => this.handleDelete(value._id)}
                    >
                      <a-button icon={"delete"}>删除</a-button>
                    </a-popconfirm>
                  </div>
                );
              }
            }
          }}
        ></a-table>
        {this.rendermodalForm()}
      </div>
    );
  }
};
</script>
