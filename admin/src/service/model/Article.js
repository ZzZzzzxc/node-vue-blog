import { baseModel } from "../baseModel";
import Axios from "../../plugins/axios";
//请求模型
export class Article extends baseModel {
  constructor(modelName, id, req) {
    super(modelName, id, req);
  }
}

//表格行
export const columns = [
  {
    title: "文章id",
    dataIndex: "_id",
    key: "_id",
    width: 280
  },
  {
    title: "图片",
    key: "banner",
    width: 240,
    scopedSlots: { customRender: "banner" }
  },
  {
    title: "文章标题",
    width: 280,
    key: "title",
    scopedSlots: { customRender: "title" }
  },
  {
    title: "文章描述",
    width: 300,
    key: "description",
    scopedSlots: { customRender: "description" }
  },
  {
    title: "创建时间",
    width: 250,
    key: "created",
    scopedSlots: { customRender: "created" }
  },
  {
    title: "最近编辑时间",
    width: 250,
    key: "updated",
    scopedSlots: { customRender: "updated" }
  },
  {
    title: "是否展示",
    dataIndex: "isShow",
    width: 150,
    key: "isShow"
  },
  {
    title: "文章访问次数",
    dataIndex: "nums",
    key: "nums",
    width: 150
  },
  {
    title: "是否原创",
    dataIndex: "isOriginal",
    key: "isOriginal",
    width: 150
  },
  {
    title: "文章标签",
    key: "tags",
    width: 400,
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 100,
    scopedSlots: { customRender: "action" }
  }
];

export default {};
