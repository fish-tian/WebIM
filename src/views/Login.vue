<template>
  <v-card v-if="loginSeen" class="mx-auto" min-width="400px" max-width="400px" style="margin: 40px">
    <v-card-title>登录</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          label="用户名"
          prepend-icon="mdi-account-circle-outline"
        ></v-text-field>
        <v-text-field
          label="密码"
          type="password"
          prepend-icon="mdi-lock-outline"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
        
      <v-btn color="success"  :to="{ name: 'Home' }" @click="changeSeen">登录</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="info">注册</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
    data() {
        return {
            loginSeen: true
        }
    },
    methods: {
        // 简单进行隐藏
        changeSeen() {
            this.loginSeen = !this.loginSeen;
        }
    }
}
</script>