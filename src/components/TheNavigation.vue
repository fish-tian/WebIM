<template>
  <v-app-bar app color="transparent" dark>
    <v-img src="@/assets/logo.png" max-height="36px" max-width="36px"></v-img>
    <v-btn text> 联系人 </v-btn>
    <!-- <v-btn text> 会话 </v-btn> -->

    <v-spacer></v-spacer>

    <v-avatar size="36">
      <v-img :src="require('@/assets/' + user.userAvatar)" alt="userAvatar"> </v-img>
    </v-avatar>

    <v-btn
      to="/login"
      target="_blank"
      text
      @click="logout"
    >
      注销
    </v-btn>
  </v-app-bar>
</template>

<script>
import store from "@/store.js";

export default {
    data() {
        return {
            user: store.user,
        }
    },
    methods : {
      // 注销
      logout() {
        sessionStorage.setItem("demo-token", null); // 将token清空
        this.$router.push("/login");
      }
    }
}
</script>