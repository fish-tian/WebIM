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
    </v-list>
  </v-card>
</template>

<script>
// import store from "@/store.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      alert: false,
      alertMessage: "",
      alertType: "",
      friendName: "",
    };
  },
  computed: {},
  mounted() {},
  methods: {
    showAlert(alertMessage, alertType) {
      this.alert = true;
      this.alertMessage = alertMessage;
      this.alertType = alertType;

      setTimeout(() => {
        this.alert = false;
      }, 3000);
    },
    // 简单进行隐藏
    addFriend() {
      let data = {friendName: this.friendName};
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