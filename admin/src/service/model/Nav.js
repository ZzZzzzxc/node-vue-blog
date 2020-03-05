import { baseModel } from "../baseModel";

//请求模型
export class Nav extends baseModel {
  constructor(modelName, id, req) {
    super(modelName, id, req);
  }
}

//表格行
export const columns = [
  {
    title: "id",
    width: 250,
    dataIndex: "_id",
    key: "_id"
  },
  {
    title: "名称",
    width: 150,
    dataIndex: "title",
    key: "title"
  },
  {
    title: "路径",
    width: 150,
    dataIndex: "path",
    key: "path"
  },
  {
    title: "创建时间",
    dataIndex: "created",
    width: 250,
    key: "created"
  },
  {
    title: "最近编辑时间",
    dataIndex: "updated",
    width: 250,
    key: "updated"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {};
