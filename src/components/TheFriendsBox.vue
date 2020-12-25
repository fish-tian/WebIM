<template>
  <!-- v-card 里是联系人卡片 -->
  <v-card>
    <v-list subheader dense>
      <v-subheader>联系人</v-subheader>
      <!-- <v-list-item> 里是单个联系人 -->
      <v-hover
        v-slot:default="{ hover }"
        v-for="friend in friends"
        :key="friend.userId"
      >
        <v-list-item :to="{ name: 'Chat', params: { id: friend.userId } }">
          <v-list-item-avatar size="36px">
            <v-img
              :src="require('@/assets/' + friend.userAvatar)"
              alt="avatar1"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> {{ friend.username }} </v-list-item-title>
          </v-list-item-content>

          <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay>
        </v-list-item>
      </v-hover>
      <!-- <v-hover v-slot:default="{ hover }">
        <v-list-item to="/about">
          <v-list-item-avatar size="36px">
            <img src="@/assets/avatar1.jpeg" alt="avatar1" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> 尼古拉斯·磊 </v-list-item-title>
          </v-list-item-content>

          <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay>
        </v-list-item>
      </v-hover>

      <v-hover v-slot:default="{ hover }">
        <v-list-item to="/home">
          <v-list-item-avatar size="36px">
            <img src="@/assets/avatar2.jpeg" alt="avatar1" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> 莱昂纳多·虎 </v-list-item-title>
          </v-list-item-content>

          <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay>
        </v-list-item>
      </v-hover>

      <v-hover v-slot:default="{ hover }">
        <v-list-item>
          <v-list-item-avatar size="36px">
            <img src="@/assets/avatar3.jpeg" alt="avatar1" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> 克里斯蒂安·恒 </v-list-item-title>
          </v-list-item-content>
          <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay>
        </v-list-item>
      </v-hover> -->
    </v-list>
  </v-card>
</template>

<script>
import store from "@/store.js";
export default {
  data() {
    return {
      friends: store.friends,
    };
  },
};
</script>