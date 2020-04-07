<script>
import { Logo } from "../../../service/model/Logo";
const logo = new Logo("Logos");
export default {
  name: "logo",
  data() {
    return {
      title: "Logo设置",
      form: this.$form.createForm(this),
      tagList: [],
      selectedItems: [],
      //表单图片
      imageUrl: "",
      uploading: false,
      id: null,
      loading: false,
      isUse: 1
    };
  },
  methods: {
    async getLogo() {
      this.loading = true;
      await logo
        .getList()
        .then(res => {
          if (res[0]._id) {
            this.id = res[0]._id;
            this.getLogoById(this.id);
          }
        })
        .catch(err => this.$message.error(err))
        .finally(() => {
          this.loading = false;
        });
    },
    async postLogo(req) {
      let res = await logo.post(req);
      this.$message.success("创建成功");
    },
    async getLogoById(id) {
      await logo
        .getById(id)
        .then(res => {
          this.imageUrl = res.banner;
          this.form.setFieldsValue({
            banner: res.banner,
            title: res.title,
            isUse:res.isUse
          });
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async putLogo(req) {
      let res = await logo.put(this.id, req);
      this.$message.success("编辑成功");
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.id) {
            this.putLogo(Object.assign(values));
          } else {
            this.postLogo(Object.assign(values));
          }
        }
      });
    },
    onRadioChange(e) {
      console.log(e.target.value);
    },
    //表单
    beforeUpload(file) {
      this.uploading = true;
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isLt2M) {
        this.$message.error("图片不能超过3M");
      }
      this.uploading = false;
      return isLt2M;
    },
    handleUpload(data) {
      this.upload(data);
    },
    async upload(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      await logo
        .uploadByQiniu({ key: data.file.type + "/" + data.file.name })
        .then(res => {
          console.log("成功获取token");
          formData.append("token", res.uploadToken);
          this.$http.post("https://up-z2.qiniup.com/", formData).then(res => {
            this.imageUrl = res.url;
            this.form.setFieldsValue({
              banner: res.url
            });
          });
        })
        .catch(err => {
          console.log("未能成功获取token");
        })
        .finally(() => {
          this.uploading = false;
        });
    },
    renderBannerUpload() {
      return (
        <a-upload
          class="avatar-uploader"
          beforeUpload={this.beforeUpload}
          showUploadList={false}
          customRequest={this.handleUpload}
          v-decorator={["banner"]}
        >
          {this.imageUrl ? (
            <img src={this.imageUrl} style={"max-height:100%"}></img>
          ) : (
            <div style={"width:100%;height:100%;position:relative;"}>
              <div
                style={
                  "position: absolute;top:50%;left:50%;transform:translate(-50%,-50%)"
                }
              >
                {this.uploading ? (
                  <div style={"text-align:center"}>
                    <a-icon type="loading" />
                  </div>
                ) : (
                  <div style={"text-align:center"}>
                    <a-icon type="plus" />
                  </div>
                )}
                <div>Logo</div>
              </div>
            </div>
          )}
        </a-upload>
      );
    },
    renderTitleInput() {
      return (
        <a-input
          allowClear={true}
          placeholder="请输入标题"
          v-decorator={[
            "title",
            {
              rules: [{ required: true, message: "请输入标题" }]
            }
          ]}
        >
          <a-icon slot="prefix" type="smile" />
          <a-tooltip slot="suffix" title="＞﹏＜">
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </a-input>
      );
    },
    renderRadio() {
      return (
        <a-radio-group onChange={this.onRadioChange} 
        v-decorator={[
            "isUse",
            {
              rules: [{ required: true, message: "请选择" }]
            }
          ]}>
          <a-radio value={1}>启用</a-radio>
          <a-radio value={0}>不启用</a-radio>
        </a-radio-group>
      );
    }
  },
  created() {
    this.getLogo();
  },
  mounted() {},
  render() {
    return (
      <a-skeleton
        active={true}
        loading={this.loading}
        avatar
        title={{ width: 200 }}
        paragraph={{ rows: 8 }}
      >
        <a-form form={this.form}>
          <a-form-item label="图片">{this.renderBannerUpload()}</a-form-item>
          <a-form-item label="标题" style={"width:30%"}>
            {this.renderTitleInput()}
          </a-form-item>
          <a-form-item label="Logo是否要使用图片">
            {this.renderRadio()}
          </a-form-item>
          <a-button onClick={this.submit} class="commit">
            {"提交"}
          </a-button>
        </a-form>
      </a-skeleton>
    );
  }
};
</script>
<style>
.avatar-uploader > .ant-upload {
  z-index: 1000;
  width: 128px;
  height: 128px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
}
.commit {
  position: fixed;
  right: 10px;
  top: 20vh;
  color: black;
  border-radius: 5%;
  /* height: 100px; */
  width: 80px;
  text-align: center;
  /* background: pink; */
  z-index: 110;
}
</style>
