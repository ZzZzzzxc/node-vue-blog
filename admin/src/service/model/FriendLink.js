import { baseModel } from "../baseModel";

//请求模型
export class FriendLink extends baseModel {
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
    title: "头像",
    key: "avatar",
    width: 240,
    scopedSlots: { customRender: "avatar" }
  },
  {
    title: "名称",
    width: 150,
    dataIndex: "title",
    key: "title"
  },
  {
    title: "链接",
    width: 150,
    dataIndex: "url",
    key: "url"
  },
  {
    title: "文章描述",
    width: 300,
    key: "description",
    scopedSlots: { customRender: "description" }
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
