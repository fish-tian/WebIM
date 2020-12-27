<template>
  <v-container>
    <v-card
      class="mx-auto"
      min-width="400px"
      max-width="400px"
      style="margin: 40px"
      v-if="loginSeen"
    >
      <v-card-title>登录</v-card-title>
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

export default {
  data() {
    return {
      loginSeen: true,
      username: "",
      email: "",
      password: "",
      password1: "",
    };
  },
  methods: {
    // 简单进行隐藏
    changeSeen() {
      this.loginSeen = !this.loginSeen;
    },
    // 登录
    login() {
      let user = {
        username: this.username,
        password: this.password,
      };

      if (this.account === "") {
        this.$message.error("用户名不能为空！");
        return;
      }
      if (this.password === "") {
        this.$message.error("密码不能为空！");
        return;
      }

      axios
        .post("/auth/user", user)
        .then((response) => {
          alert(response);
        })
        .catch((err) => {
          alert(err);
        });
    },
    // 注册
    register() {
      if (this.username === "") {
        this.$message.error("用户名不能为空！");
        return;
      }
      if (this.email === "") {
        this.$message.error("邮箱不能为空！");
        return;
      }
      let reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (!reg.test(this.email)) {
        this.$message.error("邮箱格式不正确！");
        return;
      }
      if (this.password === "") {
        this.$message.error("密码不能为空！");
        return;
      }
      if (this.password1 === "") {
        this.$message.error("确认密码不能为空！");
        return;
      }
      if (this.password != this.password1) {
        this.$message.error("两次密码不一致！");
        return;
      }
      let user = {
        username: this.username,
        password: this.password,
        email: this.email,
      };

      axios
        .post("/auth/user/register", user)
        .then((response) => {
          alert(response);
        })
        .catch((err) => {
          alert(err);
        });
      // let user = {
      //     username: this.username,
      //     password: this.password,
      //     email: this.email
      // }
      // axios.post('/api/register', user)
      // .then((response)=>{alert(response);})
      // .catch((err)=>{alert(err);});
    },
  },
};
</script>