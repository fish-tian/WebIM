<template>
  <v-container>
    <v-card
      class="mx-auto"
      min-width="400px"
      max-width="400px"
      style="margin: 40px"
      margin="200"
      v-if="loginSeen"
    >
      <v-card-title>登录</v-card-title>
      <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>

      <v-card-text>
        <v-form>
          <v-text-field
            label="用户名"
            prepend-icon="mdi-account-circle-outline"
            key="username"
            v-model="username"
          ></v-text-field>
          <v-text-field
            label="密码"
            type="password"
            prepend-icon="mdi-lock-outline"
            key="password"
            v-model="password"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="login">登录</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="changeSeen"> 没有账号？马上注册</v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      class="mx-auto"
      min-width="400px"
      max-width="400px"
      style="margin: 40px"
      v-if="!loginSeen"
    >
      <v-card-title>注册</v-card-title>
      <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>
      <v-card-text>
        <v-form>
          <v-text-field
            label="邮箱"
            prepend-icon="mdi-email-outline"
            key="email"
            v-model="email"
          ></v-text-field>
          <v-text-field
            label="用户名"
            prepend-icon="mdi-account-circle-outline"
            key="username"
            v-model="username"
          ></v-text-field>
          <v-text-field
            label="密码"
            type="password"
            prepend-icon="mdi-lock-outline"
            key="password"
            v-model="password"
          ></v-text-field>
          <v-text-field
            label="确认密码"
            type="password"
            prepend-icon="mdi-lock-outline"
            key="password1"
            v-model="password1"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="register">注册</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="changeSeen"> 已有账号？立即登录</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      loginSeen: true,
      username: "",
      email: "",
      password: "",
      password1: "",
      alert: false,
      alertMessage: "",
      alertType: "",
    };
  },
  methods: {
    // 简单进行隐藏
    changeSeen() {
      this.loginSeen = !this.loginSeen;
    },
    showAlert(alertMessage, alertType) {
      this.alert = true;
      this.alertMessage = alertMessage;
      this.alertType = alertType;

      setTimeout(() => {
        this.alert = false;
      }, 3000);
    },
    // 登录
    login() {
      let user = {
        username: this.username,
        password: this.password,
      };

      if (this.username === "") {
        this.showAlert("用户名不能为空！", "warning");
        return;
      }
      if (this.password === "") {
        this.showAlert("密码不能为空！", "warning");
        return;
      }

      axios
        .post("/api/user", user)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("登录成功，正在跳转至主页！", "success");
            setTimeout(() => {
              this.$router.push({ name: "Home" }); // 进入主页
            }, 3000);
          } else {
            this.showAlert(res.data.info, "error"); // 登录失败，显示提示语
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          this.showAlert(err, "error");
        });
    },
    // 注册
    register() {
      if (this.username === "") {
        this.showAlert("用户名不能为空！", "warning");
        return;
      }
      if (this.password === "") {
        this.showAlert("密码不能为空！", "warning");
        return;
      }
      let reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (!reg.test(this.email)) {
        this.showAlert("邮箱格式不正确！", "warning");
        return;
      }
      if (this.email === "") {
        this.showAlert("邮箱不能为空！", "warning");
        return;
      }
      if (this.password1 === "") {
        this.showAlert("确认密码不能为空！", "warning");
        return;
      }
      if (this.password != this.password1) {
        this.showAlert("两次密码不一致！", "warning");
        return;
      }

      let user = {
        username: this.username,
        password: this.password,
        email: this.email,
      };

      axios
        .post("/api/user/register", user)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("注册成功，正在跳转至主页！", "success");
            setTimeout(() => {
              this.$router.push({ name: "Home" }); // 进入主页
            }, 3000);
          } else {
            this.showAlert(res.data.info, "error"); // 注册失败，显示提示语
          }
        })
        .catch(() => {
          this.showAlert("请求错误！", "error");
        });
    },
  },
};
</script>