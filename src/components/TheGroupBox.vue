<template>
  <!-- v-card 里是请求卡片 -->
  <v-card
    v-if="storeState.show[3]"
    max-width="250px"
    min-width="250px"
    max-height="800px"
    tile
  >
    <v-card-text>发起群聊</v-card-text>
    <v-card
      tile
      max-width="250px"
      min-width="250px"
      min-height="526px"
        max-height="526px"
      class="overflow-y-auto fill-height"
    >
      <v-list subheader dense >
        <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>

        <v-list-item>
          <v-text-field
            placeholder="输入对方用户名"
            outlined
            clearable
            dense
            v-model="friendName"
            @keypress.enter="addUser"
            style="margin: 2px"
          >
            <template v-slot:append-outer>
              <v-btn icon @click="addUser">
                <v-icon>mdi-plus-box</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-list-item>

        <v-list-item v-for="friend in users" :key="friend.id">
          <v-list-item-avatar>
            <v-avatar color="orange" size="36">
              <span class="white--text headline">{{
                friend.user_name[0]
              }}</span>
            </v-avatar>
          </v-list-item-avatar>
          <!-- <v-badge left dot bottom bordered offset-x="-20"> -->
          <v-list-item-content>
            <v-list-item-title> {{ friend.user_name }} </v-list-item-title>
          </v-list-item-content>
          <!-- </v-badge> -->

          <!-- <v-list-item-action>
            <v-btn icon @click="openChat(friend)">
              <v-icon color="green">mdi-message</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon @click="delFriend(friend.fid)">
              <v-icon color="red">mdi-close-circle</v-icon>
            </v-btn>
          </v-list-item-action> -->

          <!-- <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay> -->
        </v-list-item>
        <v-list-item v-if="actionShow">
          <v-container>
            <v-row>
              <v-col>
                <v-btn color="green" icon block @click="createGroup">创建群聊
                  <!-- <v-icon>mdi-check-circle</v-icon> -->
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="grey" icon block @click="users=[]"> 取消
                  <!-- <v-icon>mdi-close-circle</v-icon> -->
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
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
      users: [], // 保存邀请群聊的用户
    };
  },
  computed: {
      actionShow: function() {
          return this.users.length > 0;
      }
  },
  mounted() {},
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
    // 添加用户
    addUser() {
      let data = { friendName: this.friendName };
      axios
        .post("/api/group/addUser", data)
        .then((res) => {
          if (res.data.success) {
            this.users.push(res.data.info);
            this.friendName = "";
          } else {
            this.showAlert(res.data.info, "error");
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          console.log(err);
        });
    },
    // 创建群聊
    createGroup() {
      let temp = [];
      temp.push(...this.users);
      let data = {users: temp};
      this.users = [];
      axios
        .post("/api/group/createGroup", data)
        .then((res) => {
          if (res.data.success) {
            // 创建群聊成功，重新获取所有会话
            this.getAllSessions();
          } else {
            this.showAlert(res.data.info, "error");
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          console.log(err);
        });
    },
    //获取所有会话
    // async getAllSessions() {
    //   // 如果 cookie 中有 session，就请求获取好友列表
    //   if (this.$cookies.get("koa.sess")) {
    //     axios
    //       .get("/api/session/getAll")
    //       .then((res) => {
    //         if (res.data.success) {
    //           store.setSessions(res.data.info);
    //           for (const session of res.data.info) {
    //             let group=true;
    //             this.getAllMessages(session.sid,group);
    //           }

    //           //this.lists = res.data.lists;
    //         } else {
    //           store.setSessions(null);
    //         }
    //       })
    //       .catch((err) => {
    //         alert(err);
    //       });
    //   }
    // },
  },
};
</script>