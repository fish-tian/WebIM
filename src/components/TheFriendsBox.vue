<template>
  <!-- v-card 里是联系人卡片 -->
  <v-card>
    <v-list subheader dense>
      <v-subheader>联系人</v-subheader>
      <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>

      <v-hover
        v-slot:default="{ hover }"
        v-for="friend in friends"
        :key="friend.id"
      >

      <v-list-item :to="{ name: 'Chat', params: { id: friend.id } }">
      
        <v-list-item-avatar size="36px">
          <v-img :src="require('@/assets/' + 'avatar1.jpeg')" alt="avatar1" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ friend.user_name }} </v-list-item-title
          >
        </v-list-item-content>

        <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay>
      </v-list-item>
      </v-hover>
      <v-list-item v-for="list in lists" :key="list.fid">
        <v-list-item-action>
          <v-btn  color="warning" @click="delFriend(list.fid)">
            删除好友{{ list.fid }}
          </v-btn>
        </v-list-item-action>
      </v-list-item>
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
      friends: store.friends,
      lists: "",
    };
  },
  computed: {},
  mounted() {
    // 如果 cookie 中有 session，就请求获取好友列表
    if (this.$cookies.get("koa.sess")) {
      axios
        .get("/api/friend/getAll")
        .then((res) => {
          if (res.data.success) {
            store.friends = res.data.info;
            //this.localFriends = res.data.friends;
            this.friends = res.data.info;
            this.lists = res.data.lists;
            console.log(this.friends);
            console.log(this.lists);
          } else {
            store.friends = null;
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
    // 删除好友
    delFriend(fid) {
      console.log(this.fid);
      let data = { fid };
      axios
        .post("/api/friend/delFriend", data)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("成功删除好友请求！", "sucess");
            location.reload();
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
  },
};
</script>