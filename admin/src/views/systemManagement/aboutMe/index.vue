<script>
import { AboutMe } from "../../../service/model/AboutMe";
import { Tag } from "../../../service/model/Tag";
import { getTreeData, treeify } from "../../../utils/common";
import { mavonEditor } from "mavon-editor";
const aboutMes = new AboutMe("aboutMes");
export default {
  name: "aboutMe",
  components: { mavonEditor },
  data() {
    return {
      title: "关于我",
      form: this.$form.createForm(this),
      tagList: [],
      selectedItems: [],
      //表单图片
      imageUrl: "",
      uploading: false,
      //文章
      imgFileList: [],
      contextHtml: "",
      id: null,
      loading: false
    };
  },
  methods: {
    async getAboutMe() {
      this.loading = true;
      await aboutMes
        .getList()
        .then(res => {
          if (res[0]._id) {
            this.id = res[0]._id;
            this.getAboutMeById(this.id);
          }
        })
        .catch(err => this.$message.error(err)).finally(()=>{
          this.loading = false;
        });
    },
    async postAboutMe(req) {
      let res = await aboutMes.post(req);
      this.$message.success("创建成功");
    },
    async getAboutMeById(id) {
      await aboutMes
        .getById(id)
        .then(res => {
          this.imageUrl = res.banner;
          this.form.setFieldsValue({
            banner: res.banner,
            title: res.title,
            context: res.context,
            description: res.description,
            tags: res.tags
          });
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async putAboutMe(req) {
      let res = await aboutMes.put(this.id, req);
      this.$message.success("编辑成功");
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const catalog = treeify(getTreeData("v-show-content"));
          if (this.id) {
            this.putAboutMe(
              Object.assign(
                values,
                { contextHtml: this.contextHtml },
                { catalog: catalog }
              )
            );
          } else {
            this.postAboutMe(
              Object.assign(
                values,
                { contextHtml: this.contextHtml },
                { catalog: catalog }
              )
            );
          }
        }
      });
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
      await aboutMes
        .uploadByQiniu()
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
      // const res = await aboutMes.upload(formData);
      // this.uploading = false;
      // this.form.setFieldsValue({
      //   banner: res.url
      // });
      // this.imageUrl = res.url;
    },
    //文章添加图片
    async imgAdd(pos, file) {
      const req = new FormData();
      req.append("file", file);
      await aboutMes
        .upload(req)
        .then(res => {
          this.$refs.md.$img2Url(pos, res.url);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    download(value, render) {
      let title = this.form.getFieldValue("title");
      if (!title) {
        this.$message.error("请先填写标题再下载");
      } else {
        let text = value;
        let MIME_TYPE = "text/plain";
        window.URL = window.webkitURL || window.URL;
        let bb = new Blob([text], { type: MIME_TYPE });
        let a = document.createElement("a");
        a.download = title + ".md";
        a.href = window.URL.createObjectURL(bb);
        a.textContent = "Download_ready";
        a.dataset.download = [MIME_TYPE, a.download, a.href].join(":");
        a.click();
      }
    },
    getHtmlData(val, render) {
      this.contextHtml = render;
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
    renderDescriptionTextArea() {
      return (
        <a-textarea
          style={"height:100px"}
          autosize={false}
          placeholder="请输入描述"
          v-decorator={[
            "description",
            {
              rules: [{ required: true, message: "请输入描述" }]
            }
          ]}
        ></a-textarea>
      );
    }
  },
  created() {
    this.getAboutMe();
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
          <a-form-item label="描述" style={"width:60%"}>
            {this.renderDescriptionTextArea()}
          </a-form-item>
          <a-form-item label="内容（MarkDown语法）">
            <mavon-editor
              ref="md"
              id="md"
              style={"height:800px;z-index:0"}
              placeholder="...请开始你的表演"
              autofocus={false}
              htmlcode={true}
              onImgAdd={this.imgAdd}
              onSave={this.download}
              onChange={this.getHtmlData}
              v-decorator={[
                "context",
                {
                  initialValue: "",
                  rules: [{ required: true, message: "你是不是忘了啥" }]
                }
              ]}
            />
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
