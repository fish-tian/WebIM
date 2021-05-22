<template>
  <!-- v-card 里是请求卡片 -->
  <v-card
    v-if="storeState.show[2]"
    max-width="250px"
    min-width="250px"
    max-height="800px"
    tile
  >
    <v-card-text>寻找好友</v-card-text>
    <v-card
      tile
      max-width="250px"
      min-width="250px"
      min-height="526px"
        max-height="526px"
      class="overflow-y-auto fill-height"
    >
      <v-list subheader dense>
        <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>

        <v-list-item>
          <v-text-field
            placeholder="输入对方用户名"
            outlined
            clearable
            dense
            v-model="friendName"
            @keypress.enter="addFriend"
            style="margin: 2px"
          >
            <template v-slot:append-outer>
              <v-btn icon @click="addFriend">
                <v-icon>mdi-plus-box</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-list-item>
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
        </v-list-item>
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
    //this.getAllRequests();
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
      // if (this.$cookies.get("koa.sess")) {
      //   axios
      //     .get("/api/friend/getAll")
      //     .then((res) => {
      //       if (res.data.success) {
      //         store.setFriends(res.data.info);
      //         //this.friends = res.data.info;
      //         this.lists = res.data.lists;
      //         //console.log(this.friends);
      //         //console.log(this.lists);
      //       } else {
      //         store.setFriends(null);
      //       }
      //     })
      //     .catch((err) => {
      //       alert(err);
      //     });
      // }
    },
  },
};
</script>