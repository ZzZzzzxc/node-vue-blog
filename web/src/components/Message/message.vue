<script>
import './message.less'
let seed = 0;

function getUuid() {
  return "global_message" + seed++;
}

export default {
  data() {
    return {
      notices: []
    };
  },
  methods: {
    add(notice) {
      const name = getUuid();
      let _notice = Object.assign(
        {
          name: name
        },
        notice
      );
      if (this.notices.length > 3) {
        this.notices.shift();
      }
      this.notices.push(_notice);

      // 定时移除，单位：秒
      const duration = notice.duration;
      setTimeout(() => {
        this.remove(name);
      }, duration * 1000);
    },
    remove(name) {
      const notices = this.notices;
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].name === name) {
          this.notices.splice(i, 1);
          break;
        }
      }
    }
  },
  render() {
    return (
      <div class="global-message">
        <transition-group name="fade">
          {this.notices.map(item => {
            return (
              <div class="global-message-main" key="item.name">
                <div class="global-message-content">{item.content}</div>
              </div>
            );
          })}
        </transition-group>
      </div>
    );
  }
};
</script>
