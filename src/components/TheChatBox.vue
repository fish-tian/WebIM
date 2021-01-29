<template>
  <div>
    <!-- v-card 里是对话框卡片 -->
    <v-card min-width="450px">
      <!-- v-list 里是对话 -->
      <v-list subheader dense>
        <v-subheader> {{ friend.username }} </v-subheader>
        <!-- <v-list-item> 里是单个信息 -->
        <v-list-item v-for="messageItem in message" :key="messageItem.mId">
          <v-list-item-avatar size="24px" v-if="messageItem.isSender===0">
            <v-img :src="require('@/assets/' + 'avatar1.jpeg')" alt="avatar1" />
          </v-list-item-avatar>
          <v-list-item-content :class="messageItem.isSender ? 'text-right align-self-start' : ''">
            <v-list-item-title> {{ messageItem.content }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-text-field
        placeholder="发送信息"
        outlined
        dense
        style="padding: 0px 20px; font-size: 13px"
      ></v-text-field>
    </v-card>
  </div>
</template>

<script>
import store from "@/store.js";

export default {
  data() {
    return {
      friendId: this.$route.params.id,
      userId: store.user.id
    }
  },
  computed: {
    friend() {
      return store.friends.find(
        friend => friend.id === this.friendId
      )
    },
    message() {
      return store.messages.sort(
        (message1, message2) => message1.timestamp - message2.timestamp
      ).filter(
        message => message.id === this.friendId
      )
    }
  }
}
</script>
