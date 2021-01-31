<template>
  <!-- v-card 里是联系人卡片 -->
  <v-card>
    <v-list subheader dense>
      <v-subheader>联系人</v-subheader>
      <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>
       

      <!-- <v-hover
        v-slot:default="{ hover }"
        v-for="friend in storeState.friends"
        :key="friend.id"
      > 
      <v-list-item
        :to="{ name: 'Chat', params: { id: friend.id } }"
        v-for="friend in storeState.friends"
        :key="friend.id"
      >
      -->
      <v-list-item
        v-for="friend in storeState.friends"
        :key="friend.id"
      >
        <v-list-item-avatar size="36px">
          <v-img :src="require('@/assets/' + 'avatar1.jpeg')" alt="avatar1" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> {{ friend.user_name }} </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon color="green">mdi-message</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn icon @click="delFriend(friend.fid)">
            <v-icon color="red" >mdi-close-circle</v-icon>
            {{friend.fid}}
          </v-btn>
        </v-list-item-action>
        <!-- <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay> -->
      </v-list-item>
      <!-- </v-hover> -->
      
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
      //localFriends: store.friends,
      //friends: store.friends,
      storeState: store.state,
      lists: "",
      alert: false,
      alertMessage: "",
      alertType: "",
    };
  },
  computed: {},
  mounted() {
    this.getAllFriends();
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
    // 删除好友
    delFriend(fid) {
      let data = { fid };
      axios
        .post("/api/friend/delFriend", data)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("成功删除好友！", "success");
            this.getAllFriends();
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
    //获取所有好友
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