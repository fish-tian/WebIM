<template>
  <!-- v-card 里是请求卡片 -->
  <!-- <v-card max-width="400px" max-height="800px"> -->
  <v-card v-if="storeState.friendsOrRequest === 1" max-width="350px" min-width="300px" max-height="800px">
    <v-card-text>好友请求</v-card-text>
    <v-card>
      <v-list subheader dense>
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
        <!-- <v-hover
        v-slot:default="{ hover }"
        
      > -->
        <v-list-item v-for="request in storeState.requests" :key="request.rid">
          <v-list-item-avatar size="36px">
            <v-img :src="require('@/assets/' + 'avatar1.jpeg')" alt="avatar1" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ request.uid1Name }} </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              icon
              @click="acceptRequest(request.rid, request.uid1, request.uid2)"
            >
              <v-icon color="green">mdi-checkbox-marked-circle</v-icon>
            </v-btn>
          </v-list-item-action>

          <v-list-item-action>
            <v-btn icon @click="rejectRequest(request.rid)">
              <v-icon color="red">mdi-close-circle</v-icon>
            </v-btn>
          </v-list-item-action>
          <!-- <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay> -->
        </v-list-item>
        <!-- </v-hover> -->
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
import store from "@/store.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      storeState: store.state,
      alert: false,
      alertMessage: "",
      alertType: "",
      friendName: "",
      rid: "",
      uid1: "",
      uid2: "",
    };
  },
  computed: {},
  mounted() {
    this.getAllRequests();
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
    // 获取所有请求
    getAllRequests() {
      // 如果 cookie 中有 session，就请求获取所有好友请求
      if (this.$cookies.get("koa.sess")) {
        axios
          .get("/api/friend/getAllRequests")
          .then((res) => {
            if (res.data.success) {
              store.setRequests(res.data.info);
              //this.requests = res.data.info;
              //console.log("this.requests--------");
              //console.log(this.requests);
            } else {
              store.setRequests(null);
            }
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
    // 添加好友
    addFriend() {
      let data = { friendName: this.friendName };
      axios
        .post("/api/friend/addFriend", data)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("好友请求发送成功！", "success");
            //location.reload();
            this.getAllRequests();
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
    // 接受请求
    acceptRequest(rid, uid1, uid2) {
      let data = { rid, uid1, uid2 };
      axios
        .post("/api/friend/passRequest", data)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("同意好友请求！", "success");
            this.getAllRequests();
            this.getAllFriends();
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
    // 拒绝请求
    rejectRequest(rid) {
      let data = { rid: rid };
      axios
        .post("/api/friend/rejectRequest", data)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("拒绝好友请求！", "sucess");
            //location.reload();
            this.getAllRequests();
          } else {
            this.showAlert(res.data.info, "error");
            // console.log(res.data.info);
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          //this.showAlert(err, "error");
          console.log(err);
        });
    },
    getAllFriends() {
      // 如果 cookie 中有 session，就请求获取好友列表
      if (this.$cookies.get("koa.sess")) {
        axios
          .get("/api/friend/getAll")
          .then((res) => {
            if (res.data.success) {
              store.setFriends(res.data.info);
              //this.friends = res.data.info;
              this.lists = res.data.lists;
              //console.log(this.friends);
              //console.log(this.lists);
            } else {
              store.setFriends(null);
            }
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
  },
};
</script>