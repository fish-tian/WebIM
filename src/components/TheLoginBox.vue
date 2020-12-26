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
        <v-btn color="success" @click="login"
          >登录</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn color="info" @click="changeSeen">
          没有账号？马上注册</v-btn
        >
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
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="register"
          >注册</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn color="info" @click="changeSeen">
          已有账号？立即登录</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
        loginSeen: true,
        username: undefined,
        password: undefined,
        email: undefined
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
            password: this.password
        }
        axios.post('/api/login', user)
        .then((response)=>{alert(response);})
        .catch((err)=>{alert(err);});
    },
    // 注册
    register() {
        let user = {
            username: this.username,
            password: this.password,
            email: this.email
        }
        axios.post('/api/register', user)
        .then((response)=>{alert(response);})
        .catch((err)=>{alert(err);});
    }
  },
};
</script>