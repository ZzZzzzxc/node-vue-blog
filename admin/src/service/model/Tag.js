import { baseModel } from "../baseModel";

//请求模型
export class Tag extends baseModel {
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
    title: "名称",
    width: 150,
    dataIndex: "title",
    key: "title"
  },
  {
    title: "文章关联数目",
    width: 150,
    dataIndex: "nums",
    key: "nums"
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
