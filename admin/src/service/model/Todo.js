import { baseModel } from "../baseModel";

//请求模型
export class Todo extends baseModel {
  constructor(modelName, id, req) {
    super(modelName, id, req);
  }
}

export default {};
