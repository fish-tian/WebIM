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