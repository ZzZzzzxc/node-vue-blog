import { qiniuModel } from "../qiniuModel";

//请求模型
export class File extends qiniuModel {
  constructor(modelName, id, req) {
    super(modelName, id, req);
  }
}

//表格行
export const columns = [
  {
    title: "存储Key",
    width: 150,
    dataIndex: "key",
    key: "key",
    scopedSlots: { customRender: "content" }
  },
  {
    title: "类型",
    width: 100,
    dataIndex: "mimeType",
    key: "mimeType"
  },
  {
    title: "存储类型",
    dataIndex: "type",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "大小",
    dataIndex: "fsize",
    scopedSlots: { customRender: "fsize" }
  },
  {
    title: "上传时间",
    dataIndex: "putTime",
    scopedSlots: { customRender: "putTime" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {};
