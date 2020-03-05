import { baseModel } from "../baseModel";

//请求模型
export class User extends baseModel {
  constructor(modelName, id, req) {
    super(modelName, id, req);
  }
}

//表格行
export const columns = [
  {
    title: "标签id",
    width: 250,
    dataIndex: "_id",
    key: "_id"
  },
  {
    title: "权限",
    width: 150,
    scopedSlots: { customRender: "roles" },
    key: "roles"
  },
  {
    title: "名称",
    width: 150,
    dataIndex: "name",
    key: "name"
  },
  {
    title: "账号",
    width: 150,
    dataIndex: "account",
    key: "account"
  },
  {
    title: "创建时间",
    dataIndex: "created",
    width: 250,
    key: "created"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {};
