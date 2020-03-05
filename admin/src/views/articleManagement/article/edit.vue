<script>
import { Article } from "../../../service/model/Article";
import { Tag } from "../../../service/model/Tag";
import { getTreeData, treeify } from "../../../utils/common";
import { mavonEditor } from "mavon-editor";
const article = new Article("articles");
const tag = new Article("tags");
export default {
  name: "articleEdit",
  components: { mavonEditor },
  props: {
    id: String
  },
  data() {
    return {
      title: "文章编辑",
      form: this.$form.createForm(this),
      tagList: [],
      selectedItems: [],
      //表单图片
      imageUrl: "",
      uploading: false,
      //文章
      imgFileList: [],
      contextHtml: "",
      codeStyle: "atom-one-dark",
      loading: false,
      selectionLoading: false
    };
  },
  methods: {
    async fetchTagList() {
      this.selectionLoading = true;
      await tag
        .getList()
        .then(res => {
          this.tagList = res;
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally((this.selectionLoading = false));
    },
    async postArticle(req) {
      await article
        .post(req)
        .then(res => {
          this.$message.success("新建文章成功");
          this.toArticleList();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    async getArticleById(id) {
      await article
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
    async putArticle(req) {
      let res = await article.put(this.id, req);
      this.$message.success("编辑文章成功");
      this.$router.push("/article/list");
    },
    handleChange(selectedItems) {
      this.selectedItems = selectedItems;
    },
    toArticleList() {
      this.$router.push("/article/list");
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const catalog = treeify(getTreeData("v-show-content"));
          if (this.id) {
            this.putArticle(
              Object.assign(
                values,
                { contextHtml: this.contextHtml },
                { catalog: catalog }
              )
            );
          } else {
            this.postArticle(
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
    },
    async handleUpload(data) {
      this.upload(data);
    },
    async upload(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      await article
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
      // const res = await article.upload(formData);
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
      // await article
      //   .upload(req)
      //   .then(res => {
      //     this.$refs.md.$img2Url(pos, res.url);
      //   })
      //   .catch(err => {
      //     this.$message.error(err);
      //   });
      await article
        .uploadByQiniu()
        .then(res => {
          console.log("成功获取token");
          req.append("token", res.uploadToken);
          this.$http.post("https://up-z2.qiniup.com/", req).then(res => {
            this.$refs.md.$img2Url(pos, res.url);
          });
        })
        .catch(err => {
          this.$message.error(err);
          console.log("未能成功获取token");
        })
        .finally(() => {
          this.uploading = false;
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
          v-decorator={[
            "banner",
            {
              rules: [{ required: true, message: "请上传图片" }]
            }
          ]}
        >
          {this.imageUrl ? (
            <img
              src={this.imageUrl}
              style={"max-height:100%"}
            ></img>
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
    renderTagSelect() {
      return (
        <a-select
          mode="multiple"
          style="width: 100%"
          onChange={this.handleChange}
          allowClear={true}
          defaultActiveFirstOption={false}
          dropdownStyle={{}}
          placeholder="请选择文章标签"
          loading={this.selectionLoading}
          v-decorator={[
            "tags",
            {
              rules: [{ required: true, message: "请输入文章标签" }]
            }
          ]}
        >
          {this.tagList.map(item => {
            return (
              <a-select-option key={item._id}>{item.title}</a-select-option>
            );
          })}
        </a-select>
      );
    },
    renderTitleInput() {
      return (
        <a-input
          allowClear={true}
          placeholder="请输入文章标题"
          v-decorator={[
            "title",
            {
              rules: [{ required: true, message: "请输入文章标题" }]
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
          placeholder="请输入文章描述"
          v-decorator={[
            "description",
            {
              rules: [{ required: true, message: "请输入文章描述" }]
            }
          ]}
        ></a-textarea>
      );
    }
  },
  created() {
    this.fetchTagList();
    if (this.id) {
      this.title = "文章编辑";
      this.getArticleById(this.id);
    } else {
      this.title = "新建文章";
    }
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
          <a-form-item label="文章标签" style={"width:20%"}>
            {this.renderTagSelect()}
          </a-form-item>
          <a-form-item label="文章标题" style={"width:30%"}>
            {this.renderTitleInput()}
          </a-form-item>
          <a-form-item label="文章描述" style={"width:60%"}>
            {this.renderDescriptionTextArea()}
          </a-form-item>
          <a-form-item label="文章内容（MarkDown语法）">
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
              codeStyle={this.codeStyle}
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
