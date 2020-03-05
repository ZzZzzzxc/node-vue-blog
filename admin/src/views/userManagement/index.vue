<script>
import { User, columns } from "../../service/model/User";
import { Role } from "../../service/model/Role";
import toolBar from "../../components/toolBar/index";
const user = new User("users");
const role = new Role("roles");
export default {
  name: "userList",
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
      title: "用户列表",
      //是否正在加载
      loading: true,
      //modal是否可见
      visible: false,
      //antd表单创建
      form: this.$form.createForm(this),
      roleList: [],
      selectionLoading: false,
      selectedItems:[],
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
    async fetchRoleList() {
      this.selectionLoading = true;
      await role
        .getList()
        .then(res => {
          this.roleList = res;
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally((this.selectionLoading = false));
    },
    //初始化表格数据
    async fetchData(req) {
      this.loading = true;
      await user
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
      await user
        .post(values)
        .then(res => {
          this.fetchData();
          this.$message.success("添加用户成功");
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
      await user
        .delete(id)
        .then(res => {
          this.fetchData();
          this.$message.success("删除用户成功");
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
      await user
        .getById(id)
        .then(res => {
          this.form.setFieldsValue({
            role: res.role,
            _id: res._id,
            name: res.name,
            account: res.account,
            roles:res.roles
          });
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
      await user
        .put(id, values)
        .then(res => {
          this.fetchData();
          this.$message.success("修改用户成功");
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
    },
    handleChange(selectedItems) {
      this.selectedItems = selectedItems;
    },
  },
  created() {
    this.fetchData();
    this.fetchRoleList()
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
                      title="确定要删除该用户吗?"
                      onConfirm={() => this.handleDelete(value._id)}
                    >
                      <a-button icon={"delete"}>删除</a-button>
                    </a-popconfirm>
                  </div>
                );
              },
              roles: data => {
                return data.roles.map(item => {
                  return <a-tag key={item._id}>{item.title}</a-tag>;
                });
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
            <a-form-item label="用户名称">
              <a-input
                placeholder="请输入用户名称"
                v-decorator={[
                  "name",
                  {
                    rules: [{ required: true, message: "请输入用户名称" }]
                  }
                ]}
              />
            </a-form-item>
            <a-form-item label="用户账号">
              <a-input
                placeholder="请输入用户账号"
                v-decorator={[
                  "account",
                  {
                    rules: [{ required: true, message: "请输入用户账号" }]
                  }
                ]}
              />
            </a-form-item>
            <a-form-item label="用户密码">
              <a-input
                placeholder="请输入用户密码"
                v-decorator={[
                  "password",
                  {
                    rules: [{ required: true, message: "请输入用户密码" }]
                  }
                ]}
              />
            </a-form-item>
            <a-form-item label="用户权限">
              <a-select
                style="width: 100%"
                onChange={this.handleChange}
                allowClear={true}
                defaultActiveFirstOption={false}
                dropdownStyle={{}}
                loading={this.selectionLoading}
                placeholder="请分配用户权限"
                v-decorator={[
                  "roles",
                  {
                    rules: [{ required: true, message: "请分配用户权限" }]
                  }
                ]}
              >
                {this.roleList.map(item => {
                  return (
                    <a-select-option key={item._id}>
                      {item.title}
                    </a-select-option>
                  );
                })}
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    );
  }
};
</script>
