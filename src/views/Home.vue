<template>

<v-container fluid > 
  <!-- 导航栏 -->

  <v-row>
    <v-spacer></v-spacer>
    <v-col class="d-flex">
      <TheNavigation />
      <TheSessionBox />
      <TheFriendsBox />
      <TheRequestBox />
      <TheGroupBox />
      <TheChatBox />
      <!-- <router-view/> -->
      <!-- <router-view name="friend"/> -->
      <!-- <router-view name="request"/> -->
    </v-col>
    <!-- <v-col> -->
      <v-col></v-col>
      <!-- <router-view/> -->
      <!-- <router-view name="friend"/> -->
      <!-- <router-view name="request"/> -->
    <!-- </v-col> -->
  </v-row>

</v-container>
</template>

<script>
import TheFriendsBox from "@/components/TheFriendsBox"
import TheChatBox from "@/components/TheChatBox"
import TheNavigation from '@/components/TheNavigation'
import TheRequestBox from "@/components/TheRequestBox"
import TheGroupBox from "@/components/TheGroupBox"
import TheSessionBox from "@/components/TheSessionBox"

import store from "@/store.js";
import axios from "axios";
import sharedMethods from "@/sharedMethods";
// 解决跨域
axios.defaults.withCredentials = true;

export default {
  name: "Home",
  components: {
    TheNavigation,
    TheChatBox,
    TheFriendsBox,
    TheRequestBox,
    TheGroupBox,
    TheSessionBox
  },
  data() {
    return {
      storeState: store.state,
    };
  },
  mounted() {
    this.getAll();
  },
  methods: {
    // 获取所有信息：包括会话、请求、好友、消息等
    getAll() {
      // 获取所有会话和消息
      let promise1 = sharedMethods.getAllSessions.call(this);

      promise1
        .then((res1) => {
          if (res1.data.success) {
            store.setSessions(res1.data.info);
            //console.log("res---");
            //console.log(res1.data.info);
            for (const session of res1.data.info) {
              sharedMethods.getMessage
                .call(this, session.sid)
                .then((res2) => {
                  //console.log(session);
                  if(session.group===1){
                    //console.log("Home.vue");
                    //console.log(session);
                    store.setMembers(session.sid, session.gpMemberInfos);
                  } else {
                    store.setMembers(session.sid, null);
                  }
                  console.log(this.storeState.Members);
                  if (res2.data.success) {
                    store.setMessages(session.sid, res2.data.info);
                  } else {
                    // this.showAlert(res.data.info, "error");
                  }
                })
                .catch((err) => {
                  //this.showAlert("请求错误！", "error");
                  console.log(err);
                });
            }
          } else {
            store.setSessions(null);
          }
        })
        .catch((err) => {
          console.log("111" + err);
        });

      // 获取请求
      let promise2 = sharedMethods.getAllRequests.call(this);
      promise2
        .then((res) => {
          if (res.data.success) {
            store.setRequests(res.data.info);
          } else {
            store.setRequests(null);
          }
        })
        .catch((err) => {
          console.log("222" + err);
        });

      // 获取好友
      let promise3 = sharedMethods.getAllFriends.call(this);
      promise3
        .then((res) => {
          if (res.data.success) {
            store.setFriends(res.data.info);
          } else {
            store.setFriends(null);
          }
        })
        .catch((err) => {
          console.log("333" + err);
        });
    },
  },
};
</script>
