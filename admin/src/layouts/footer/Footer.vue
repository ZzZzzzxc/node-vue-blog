<template>
  <div>
    <a-layout-footer style="text-align: center">
      <section id="footer">
        <p>
          Copyright © Zhangxc Blog {{ this.$moment(new Date()).format("YYYY") }}
        </p>
        <p>
          Powered by <a href="https://cn.vuejs.org/">Vue</a> and
          <a href="http://expressjs.com/">Express</a>
        </p>
        <p>
          <a href="http://icp.chinaz.com/info?q=zhangxc.cn"
            >粤ICP备19099522号-1</a
          >
        </p>
        <p>小站已存活{{ runtime }}</p>
      </section>
    </a-layout-footer>
  </div>
</template>
<script>
const birthday = new Date("1/16/2020 00:00:00");
export default {
  name: "admin-footer",
  data() {
    return {
      runtime: ""
    };
  },
  methods: {
    getRuntime() {
      let Y = new Date();
      let T = Y.getTime() - birthday.getTime();
      let M = 24 * 60 * 60 * 1000;
      let a = T / M;
      let A = Math.floor(a);
      let b = (a - A) * 24;
      let B = Math.floor(b);
      let c = (b - B) * 60;
      let C = Math.floor((b - B) * 60);
      let D = Math.floor((c - C) * 60);
      this.runtime = A + "天" + B + "小时" + C + "分" + D + "秒";
    }
  },
  created() {
    setInterval(this.getRuntime, 1000);
  }
};
</script>
