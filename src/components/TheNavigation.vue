<template>
  <v-card tile>
    <v-card-title>
      <v-avatar color="green" size="32">
        <span class="white--text headline">{{ storeState.user.username }}</span>
      </v-avatar>
    </v-card-title>
    <v-list>
      <v-list-item-group :value="model" mandatory>
        <v-list-item @click="changeShow(0)">
          <v-icon> mdi-chat</v-icon>
        </v-list-item>
        <v-list-item @click="changeShow(1)">
          <v-icon> mdi-account</v-icon>
        </v-list-item>
        <v-list-item @click="changeShow(2)">
          <v-icon> mdi-account-plus</v-icon>
        </v-list-item>
        <v-list-item @click="changeShow(3)">
          <v-icon> mdi-human-queue</v-icon>
        </v-list-item>
        <v-list-item @click="logout">
          <v-icon> mdi-logout</v-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
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
    };
  },
  mounted() {},
  computed: {
    model: function() {
      let show = this.storeState.show;
      let res = 0;
      for(let i = 0; i < show.length; i++) {
        if(show[i]) {
          res = i;
        }
      }
      return res;
    }
  },
  methods: {
    // 切换显示联系人、请求、群聊等
    changeShow(data) {
      store.setShow(data);
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