<template>
  <div>
    <!-- v-card 里是对话框卡片 -->
    <v-card min-width="450px">
      <!-- v-list 里是对话 -->
      <!-- <v-card-text> -->
      <v-list subheader dense>
        <v-subheader>联系人</v-subheader>
        <!-- <v-list-item> 里是单个信息 -->
        <v-list-item v-for="message in storeState.messages" :key="message.mId">
          <v-list-item-avatar size="24px" v-if="message.isSender === 0">
            <v-img :src="require('@/assets/' + 'avatar1.jpeg')" alt="avatar1" />
          </v-list-item-avatar>
          <v-list-item-content
            :class="message.isSender ? 'text-right align-self-start' : ''"
          >
            <v-list-item-title> {{ message.content }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- </v-card-text> -->

      <v-text-field
        placeholder="发送信息"
        filled
        dense
        style="padding: 0px 10px; font-size: 13px"
        @keypress.enter="sendMessage"
        v-model="message"
      >
        <template v-slot:append-outer>
          <v-btn
            depressed
            tile
            color="primary"
            class="ma-1"
            @click="sendMessage"
          >
            发送
          </v-btn>
        </template>
      </v-text-field>

    </v-card>
  </div>
</template>

<script>
import store from "@/store.js";

export default {
  data() {
    return {
      // friendId: this.$route.params.id,
      // userId: store.user.id
      storeState: store.state,
      message: "",
    };
  },
  computed: {
    // friend() {
    //   return store.friends.find(
    //     friend => friend.id === this.friendId
    //   )
    // },
    // message() {
    //   return store.messages.sort(
    //     (message1, message2) => message1.timestamp - message2.timestamp
    //   ).filter(
    //     message => message.id === this.friendId
    //   )
    // }
  },
  methods: {
    sendMessage() {},
  },
};
</script>

<style>
  .v-input__append-outer {
    margin: 0 !important
  }
</style>
