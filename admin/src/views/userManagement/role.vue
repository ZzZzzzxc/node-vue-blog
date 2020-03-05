<script>
import { Role, columns } from "../../service/model/Role";
import toolBar from "../../components/toolBar/index";
const role = new Role("roles");
export default {
  name: "roleList",
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
      title: "角色列表",
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
      //modal状态（新增 or 编辑）
      modalType: "create" || "edit"
    };
  },
  methods: {
    //初始化表格数据
    async fetchData(req) {
      this.loading = true;
      await role
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
    //新增接口
    async postData(values) {
      this.loading = true;
      await role
        .post(values)
        .then(res => {
          this.fetchData();
          this.$message.success("添加角色成功");
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
      await role
        .delete(id)
        .then(res => {
          this.fetchData();
          this.$message.success("删除角色成功");
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //获取单条数据接口
    async getDataById(id) {
      await role
        .getById(id)
        .then(res => {
          this.form.setFieldsValue({ title: res.title, _id: res._id });
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //修改接口
    async putData(id, values) {
      this.loading = true;
      await role
        .put(id, values)
        .then(res => {
          this.fetchData();
          this.$message.success("修改角色成功");
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
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
                      title="确定要删除该角色吗?"
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
            ) : (
              <div />
            )}
            <a-form-item label="角色名称">
              <a-input
                placeholder="请输入角色名称"
                v-decorator={[
                  "title",
                  {
                    rules: [{ required: true, message: "请输入角色名称" }]
                  }
                ]}
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    );
  }
};
</script>
