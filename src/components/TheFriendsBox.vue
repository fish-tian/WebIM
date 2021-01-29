<template>
  <!-- v-card 里是联系人卡片 -->
  <v-card>
    <v-list subheader dense>
      <v-subheader>联系人</v-subheader>
      
      <!-- <v-list-item> 里是单个联系人 -->
      <v-hover
        v-slot:default="{ hover }"
        v-for="friend in friends"
        :key="friend.id"
      >
        <v-list-item :to="{ name: 'Chat', params: { id: friend.id } }">
          <v-list-item-avatar size="36px">
            <v-img
              :src="require('@/assets/' + 'avatar1.jpeg')"
              alt="avatar1"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ friend.user_name }} </v-list-item-title>
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
      //localFriends: store.friends,
      friends: store.friends
    };
  },
  computed: {
  },
  mounted() {
    // 如果 cookie 中有 session，就请求获取好友列表
    if(this.$cookies.get('koa.sess')) {
      axios
        .get("/api/friend/getAll")
        .then((res) => {
          if (res.data.success) {
            store.friends = res.data.info;
            //this.localFriends = res.data.friends;
            this.friends = res.data.info;
            console.log(this.friends);
          } else {
            store.friends = null;
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  }
};
</script>