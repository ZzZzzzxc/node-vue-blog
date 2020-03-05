<template>
  <a-spin :spinning="loading">
    <div class="login-body">
      <a-form :form="form" class="login-form">
        <a-form-item
          label="用户名"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: 'Please input your name!' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="密码"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: 'Please input your password!' }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 6, offset: 6 }"
        >
          <a-button type="primary" @click="check">
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="third-party">
        <a-button
          size="large"
          shape="circle"
          @click="toGithub"
          icon="github"
          :loading="loading"
        ></a-button>
        <a-button
          type="primary"
          @click="loginByGuest"
          size="large"
          :loading="loading"
        >
          游客登录
        </a-button>
      </div>
    </div>
  </a-spin>
</template>
<script>
import { UserModel } from "../../service/userModel";
const userModel = new UserModel();
export default {
  name: "login",
  components: {},
  props: {},
  data() {
    return {
      form: this.$form.createForm(this),
      code: null,
      loading: false
    };
  },
  methods: {
    check() {
      this.form.validateFields((err, val) => {
        if (!err) {
          userModel
            .loginByNoumenon(val)
            .then(res => {
              if (res.status === 200) {
                localStorage.token = res.data.token;
                localStorage.login_way = res.data.login_way;
                this.$message.success("登录成功");
                this.$router.push({
                  path: "/"
                });
              }
            })
            .catch(err => {
              this.$message.error("登录失败");
            });
        }
      });
    },
    //重定向拼接code
    toGithub() {
      window.location.href = process.env.VUE_APP_API_GITHUB_LOGIN;
    },
    //获取code
    getGithubCode() {
      this.code = this.$route.query.code;
    },
    // GitHub登录
    loginByGithub() {
      if (this.code) {
        this.loading = true;
        userModel
          .loginByGithub({ code: this.code })
          .then(res => {
            if (res.data.token) {
              localStorage.token = res.data.token;
              localStorage.login_way = res.data.login_way;
              this.$message.success("登录成功");
              this.$router.push({
                path: "/"
              });
            } else {
              this.$message.error("登录失败");
            }
          })
          .catch(err => {
            this.$message.error("登录失败");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    //游客登录
    loginByGuest() {
      this.loading = true;
      userModel
        .loginByGuest()
        .then(res => {
          localStorage.token = res.data.token;
          localStorage.login_way = res.data.login_way;
          this.$message.success("登录成功");
          this.$router.push({
            path: "/"
          });
        })
        .catch(err => {
          this.$message.error("登录失败");
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getGithubCode();
    this.loginByGithub();
  },
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {}
};
</script>
<style scoped>
.login-body {
  margin: 0 auto;
  height: 100vh;
  position: relative;
}
.login-form {
  position: absolute;
  top: 20%;
  width: 1050px;
  left: 50%;
  transform: translateX(-50%);
}
.third-party {
  width: 30%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 10%;
}
</style>
