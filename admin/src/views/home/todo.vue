<script>
import { Todo } from "../../service/model/Todo";
import { Complete } from "../../service/model/Complete";
let todo = new Todo("todos");
let complete = new Todo("completes");
export default {
  name: "todoList",
  props: {},
  data() {
    return {
      title: "TODO",
      form: this.$form.createForm(this),
      todoList: [],
      completeList: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    async getTodo() {
      let res = await todo.getList();
      this.todoList = res;
    },
    async postTodo(req) {
      let res = await todo.post(req);
      this.getTodo();
    },
    async deleteTodo(id) {
      let res = await todo.delete(id);
      this.getTodo();
    },
    async getComplete() {
      let res = await complete.getList();
      this.completeList = res;
    },
    async postComplete(req) {
      let res = await complete.post(req);
      this.getComplete();
    },
    async deleteComplete(id) {
      let res = await complete.delete(id);
      this.getComplete();
    },
    commitInput() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postTodo(values);
          this.form.resetFields();
        }
      });
    },
    removeTodo(item, index) {
      this.deleteTodo(item._id);
      this.getTodo();
    },
    removeComplete(item,index){
      this.deleteComplete(item._id)
      this.getComplete()
    },
    finish(item, index) {
      this.deleteTodo(item._id);
      this.postComplete({ title: item.title, info: item.info });
      this.getTodo();
      this.getComplete();
    }
  },
  created() {
    this.getTodo();
    this.getComplete()
  },
  mounted() {},
  render() {
    return (
      <div>
        <a-form form={this.form}>
          <a-input-group>
            <a-row gutter={24}>
              <a-col span={6}>
                <a-form-item label="🐕">
                  <a-input
                    placeholder="title"
                    onPressEnter={this.commitInput}
                    v-decorator={[
                      "title",
                      {
                        rules: [{ required: true, message: "写点字再提交" }]
                      }
                    ]}
                  >
                    <a-icon slot="prefix" type="smile" />
                    <a-tooltip slot="suffix" title="＞﹏＜">
                      <a-icon
                        type="info-circle"
                        style="color: rgba(0,0,0,.45)"
                      />
                    </a-tooltip>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col span={18}>
                <a-form-item label="🐕">
                  <a-input
                    placeholder="info"
                    onPressEnter={this.commitInput}
                    v-decorator={[
                      "info",
                      {
                        rules: [{ required: true, message: "写点字再提交" }]
                      }
                    ]}
                  >
                    <a-icon slot="prefix" type="smile" />
                    <a-tooltip slot="suffix" title="＞﹏＜">
                      <a-icon
                        type="info-circle"
                        style="color: rgba(0,0,0,.45)"
                      />
                    </a-tooltip>
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form>
        <a-row>
         
          <a-col span={10}>
            <a-timeline mode="left">
              {this.todoList.map((item, index) => {
                return (
                  <a-timeline-item>
                    {item.title}{" "}
                    <a-button
                      onClick={() => {
                        this.removeTodo(item, index);
                      }}
                    >
                      remove
                    </a-button>
                    <a-button
                      onClick={() => {
                        this.finish(item, index);
                      }}
                    >
                      finish
                    </a-button>
                  </a-timeline-item>
                );
              })}
            </a-timeline>
          </a-col>
           <a-col span={14}>
            <a-list
              itemLayout="horizontal"
              dataSource={this.completeList}
              renderItem={(item, index) => (
                <a-list-item slot="renderItem">
                  <a-list-item-meta description={item.info}>
                    <template slot="title">
                      <span>{item.title}</span>
                      <a-button onClick={()=>{this.removeComplete(item,index)}}>remove</a-button>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              )}
            ></a-list>
          </a-col>
        </a-row>
      </div>
    );
  }
};
</script>
<style scoped></style>
