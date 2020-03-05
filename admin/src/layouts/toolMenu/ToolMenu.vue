<template>
  <div class="toolbar-right">
    <a-menu
      mode="horizontal"
      :style="{ lineHeight: '62px', height: '62px' }"
      :theme="navTheme"
    >
      <a-sub-menu>
        <span slot="title">
          <a-avatar alt="boom" :src="userInfo.avatar_url" /><span>{{
            userInfo.login
          }}</span>
        </span>
        <a-menu-item>个人中心</a-menu-item>
        <a-menu-item @click="logout">退出登录</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
import { UserModel } from "../../service/userModel";
import { removeUserMessage } from "../../utils/auth";
const userModel = new UserModel();
export default {
  name: "tool-menu",
  props: {
    navTheme: String
  },
  data() {
    return {
      userInfo: {
        login: "???",
        avatar_url: "https://cdn.zhangxc.cn/FgzEvtNVpC18HCdSN63iHGl529Hj"
      }
    };
  },
  methods: {
    logout() {
      removeUserMessage();
      this.$router.push("/login");
    },
    async getUserInfo() {
      let id = await this.$store.getters.getUser.id;
      if (id && localStorage.login_way === "github") {
        userModel
          .getUserInfoByGithub(id)
          .then(res => {
            this.$store.dispatch("handleSetUserInfo", res);
            this.userInfo = res;
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
      if (localStorage.login_way === "guest") {
        this.$store.dispatch("handleSetUserInfo", {});
        this.userInfo = {
          login: "一只游客",
          avatar_url: "http://cdn.zhangxc.cn/FkM5O2DtmOi2bdKDveBQBnzlo4qf"
        };
      }
      if (localStorage.login_way === "noumenon") {
        userModel
          .getUserInfoByNoumenon()
          .then(res => {
            this.$store.dispatch("handleSetUserInfo", res);
            this.userInfo = res;
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    }
  },
  created() {
    this.getUserInfo();
  }
};
</script>

<style scoped>
.toolbar-right {
  float: right;
  width: 15%;
}
</style>
