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
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
    data() {
        return {
            user: store.user,
        }
    },
    methods : {
      // 注销
      logout() {
        axios
        .get("/api/user/logout")
        .then((res) => {
          if (res.data.success) {
            //this.showAlert("注销成功，正在跳转至登录页！", "success");
            this.$cookies.remove('koa.sess');  // 移除session
            setTimeout(() => {
              this.$router.push({ name: "Login" }); // 进入登录页
            }, 10);
          } else {
            //this.showAlert(res.data.info, "error"); // 注销失败，显示提示语
            console.log(res.data.info);
          }
        })
        .catch((err) => {
          //this.showAlert("请求错误！", "error");
          //this.showAlert(err, "error");
          console.log(err);
        });
      }
    }
}
</script>