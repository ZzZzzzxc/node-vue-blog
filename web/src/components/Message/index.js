import Message from "./message.vue";
import Vue from "vue";

Message.newInstance = properties => {
  const props = properties || {};

  const Instance = new Vue({
    data: props,
    render(h) {
      return h(Message, {
        props: props
      });
    }
  });

  // 生成文档之外的的元素，因为不能直接挂载到body上
  const component = Instance.$mount();
  // 手动挂载到body上
  document.body.appendChild(component.$el);

  const message = Instance.$children[0];
  return {
    add(noticeProps) {
      message.add(noticeProps);
    },
    remove(name) {
      message.remove(name);
    }
  };
};

let messageInstance;

function getMessageInstance() {
  messageInstance = messageInstance || Message.newInstance();
  return messageInstance;
}

function notice({ duration = 1.5, content = "" }) {
  let instance = getMessageInstance();

  instance.add({
    content: content,
    duration: duration
  });
}

export default {
  info(options) {
    return notice(options);
  }
};
