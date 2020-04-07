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
      mp3: {
        //歌曲文件
        resourceUrl: null,
        //歌曲上传中
        uploading: false,
        //进度
        progress: -1
      },
      lrc: {
        //歌词文件
        resourceUrl: null,
        //歌词上传中
        uploading: false,
        //进度
        progress: -1
      },
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
      this.mp3.resourceUrl = res.url;
      this.lrc.resourceUrl = res.lrc;
      this.form.setFieldsValue({
        _id: res._id,
        url: res.url,
        title: res.title,
        singer: res.singer,
        lrc: res.lrc
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
      this.mp3.resourceUrl = null;
      this.mp3.progress = -1;
      this.lrc.resourceUrl = null;
      this.lrc.progress = -1;
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
      console.log(data);
      this.upload(data);
    },
    async upload(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      let type = data.file.type ? data.file.type : "lrc";
      await musics
        .uploadByQiniu({ key: type + "/" + data.file.name })
        .then(res => {
          if (type === "lrc") {
            this.lrc.uploading = true;
          } else {
            this.mp3.uploading = true;
          }
          console.log("成功获取token");
          formData.append("token", res.uploadToken);
          this.$http
            .post("https://up-z2.qiniup.com/", formData, {
              //获取上传进度
              onUploadProgress: progressEvent => {
                if (type === "lrc") {
                  this.lrc.progress = parseInt(
                    (
                      (progressEvent.loaded / progressEvent.total) *
                      100
                    ).toFixed(0)
                  );
                } else {
                  this.mp3.progress = parseInt(
                    (
                      (progressEvent.loaded / progressEvent.total) *
                      100
                    ).toFixed(0)
                  );
                }
              }
            })
            .then(res => {
              if (type === "lrc") {
                this.lrc.resourceUrl = res.url;
                this.form.setFieldsValue({
                  lrc: res.url
                });
              } else {
                this.mp3.resourceUrl = res.url;
                this.form.setFieldsValue({
                  url: res.url
                });
              }
            });
        })
        .catch(err => {
          console.log("未能成功获取token");
        })
        .finally(() => {
          if (type === "lrc") {
            this.lrc.uploading = false;
          } else {
            this.mp3.uploading = false;
          }
        });
    },
    beforeMp3Upload(file) {
      const isMP3 = file.type === "audio/mp3";
      if (!isMP3) {
        this.$message.error("请上传mp3文件");
      }
      const isLt2M = file.size / 1024 / 1024 < 30;
      if (!isLt2M) {
        this.$message.error("音频不能超过30M");
      }
      return isMP3 && isLt2M;
    },
    beforeLrcUpload(file) {
      // 没判断
      const isLRC = file.type === "";
      if (!isLRC) {
        this.$message.error("请上传lrc文件");
      }
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isLt2M) {
        this.$message.error("歌词不能超过3M");
      }
      return isLRC && isLt2M;
      return true;
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
                {typeof this.mp3.resourceUrl == "string" ? (
                  <div>{this.mp3.resourceUrl}</div>
                ) : this.mp3.progress >= 0 ? (
                  <div style="width:60%">
                    <a-progress
                      percent={this.mp3.progress}
                      strokeColor={`{  
                        "0%": "#108ee9",
                        "100%": "#87d068"
                      }`}
                    />
                  </div>
                ) : (
                  <a-upload
                    customRequest={this.handleUpload}
                    multiple={false}
                    beforeUpload={this.beforeMp3Upload}
                    showUploadList={false}
                    onChange={() => {}}
                  >
                    <a-button>
                      <a-icon type="upload" />
                      上传歌曲文件mp3
                    </a-button>
                  </a-upload>
                )}
              </div>
            </a-form-item>
            <a-form-item label="歌词文件lrc">
              <div
                v-decorator={[
                  "lrc",
                  {
                    rules: [{ required: false }]
                  }
                ]}
              >
                {typeof this.lrc.resourceUrl == "string" ? (
                  <div>{this.lrc.resourceUrl}</div>
                ) : this.lrc.progress >= 0 ? (
                  <div style="width:60%">
                    <a-progress
                      percent={this.lrc.progress}
                      strokeColor={`{
                        "0%": "#108ee9",
                        "100%": "#87d068"
                      }`}
                    />
                  </div>
                ) : (
                  <a-upload
                    customRequest={this.handleUpload}
                    multiple={false}
                    beforeUpload={this.beforeLrcUpload}
                    showUploadList={false}
                    onChange={() => {}}
                  >
                    <a-button>
                      <a-icon type="upload" />
                      上传歌词lrc文件
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
