import { baseModel } from "../baseModel";

//请求模型
export class Music extends baseModel {
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
    title: "歌名",
    width: 150,
    dataIndex: "title",
    key: "title"
  },
  {
    title: "歌手",
    width: 150,
    dataIndex: "singer",
    key: "singer"
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
