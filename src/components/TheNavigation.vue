<template>
  <v-card tile>
    <v-card-title>
      <v-avatar color="green" size="32">
        <span class="white--text headline">{{ storeState.user.username }}</span>
      </v-avatar>
    </v-card-title>
    <v-list>
      <v-list-item-group  v-model="model" mandatory>
        
        <v-list-item @click="showFriOrReq(0)">

      <v-icon> mdi-chat</v-icon>

        </v-list-item>
        <v-list-item @click="showFriOrReq(1)">
              <v-icon> mdi-account-plus</v-icon>
        </v-list-item>
        <v-list-item @click="logout">

          <v-icon> mdi-logout</v-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <!-- <v-img src="@/assets/logo.png" max-height="36px" max-width="36px"></v-img> -->
    <!-- <v-btn text :to="{ name: 'Friend' }"> 联系人 </v-btn>
    <v-btn text :to="{ name: 'Request' }"> 请求 </v-btn> -->
    

    <!-- <v-btn text> 会话 </v-btn> -->
  </v-card>
  <!-- <v-app-bar app color="transparent" dark> 
    
  </v-app-bar> -->
</template>

<script>
import store from "@/store.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      //username: "",
      storeState: store.state,
      model: 1,
    };
  },
  mounted() {},
  methods: {
    // 切换显示联系人或者请求
    showFriOrReq(data) {
      store.setFriendsOrRequest(data);
    },
    // 注销
    logout() {
      axios
        .get("/api/user/logout")
        .then((res) => {
          if (res.data.success) {
            //this.showAlert("注销成功，正在跳转至登录页！", "success");
            this.$cookies.remove("koa.sess"); // 移除session
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
    },
  },
};
</script>