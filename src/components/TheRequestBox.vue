<template>
  <!-- v-card 里是请求卡片 -->
  <v-card>
    <v-list subheader dense>
      <v-subheader>请求</v-subheader>
      <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>

      <v-list-item>
        <v-list-item-content>
          <v-text-field
            label="输入对方用户名"
            placeholder="输入对方用户名"
            solo
            v-model="friendName"
          ></v-text-field>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn color="primary" @click="addFriend"> 添加好友 </v-btn>
        </v-list-item-action>
      </v-list-item>

      <!-- <v-list-item> 里是单个请求 -->
      <v-hover
        v-slot:default="{ hover }"
        v-for="request in requests"
        :key="request.rid"
      >
        <v-list-item>
          <v-list-item-avatar size="36px">
            <v-img
              :src="require('@/assets/' + 'avatar1.jpeg')"
              alt="avatar1"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ request.uid1 }} </v-list-item-title>
          </v-list-item-content>

          <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay>
        </v-list-item>
      </v-hover>
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
      requests: "",
      alert: false,
      alertMessage: "",
      alertType: "",
      friendName: "",
    };
  },
  computed: {},
  mounted() {
    // 如果 cookie 中有 session，就请求获取所有好友请求
    if (this.$cookies.get("koa.sess")) {
      axios
        .get("/api/friend/getAllRequests")
        .then((res) => {
          if (res.data.success) {
            store.requests = res.data.info;
            //this.localFriends = res.data.friends;
            this.requests = res.data.info;
            console.log(this.requests);
          } else {
            store.requests = null;
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  },
  methods: {
    //显示提示
    showAlert(alertMessage, alertType) {
      this.alert = true;
      this.alertMessage = alertMessage;
      this.alertType = alertType;

      setTimeout(() => {
        this.alert = false;
      }, 3000);
    },
    // 添加好友
    addFriend() {
      let data = { friendName: this.friendName };
      axios
        .post("/api/friend/addFriend", data)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("好友请求发送成功！", "success");
          } else {
            this.showAlert(res.data.info, "error"); // 注销失败，显示提示语
            // console.log(res.data.info);
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          //this.showAlert(err, "error");
          console.log(err);
        });
    },
  },
};
</script>