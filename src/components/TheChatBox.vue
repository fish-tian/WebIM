<template>
  <div>
    <v-card>
      <v-card-text>联系人</v-card-text>

      <!-- v-card 里是对话框卡片 -->
      <v-card
        min-width="800px"
        max-height="380px"
        class="overflow-y-auto fill-height"
        outlined
        tile
        elevation="3"
      >
        <!-- <v-card-title>联系人</v-card-title> -->
        <!-- v-list 里是对话 -->
        <!-- <v-card-text> -->
        <!-- <v-card-text class="flex-grow-1 overflow-y-auto">
          <div v-for="message in storeState.messages" :key="message.mId">
            <div :class="{ 'd-flex flex-row-reverse': message.isSender }">
              

                    <v-chip
                      :color="message.isSender ? 'primary' : ''"
                      dark
                      style="height: auto; white-space: normal"
                      class="pa-4 mb-2"
                      v-on="on"
                    >
                      {{ message.content }}
                      <sub class="ml-2" style="font-size: 0.8rem">{{
                        message.timestamp
                      }}</sub>
                    </v-chip>



            </div>
          </div>
        </v-card-text>
        <v-card-text class="flex-shrink-1">
          <v-text-field
            label="type_a_message"
            type="text"
            no-details
            outlined
            append-outer-icon="send"
            @keyup.enter="messages.push(messageForm)"
            @click:append-outer="messages.push(messageForm)"
            hide-details
          />
        </v-card-text> -->
        <v-list subheader dense>
          <v-list-item
            v-for="message in storeState.messages"
            :key="message.mId"
            :class="{ 'd-flex flex-row-reverse': message.isSender }"
          >
            <!-- <v-list-item-avatar size="36px" v-if="message.isSender === 0">
              <v-img
                :src="require('@/assets/' + 'avatar1.jpeg')"
                alt="avatar1"
              />
            </v-list-item-avatar> -->
            <v-chip
              :color="message.isSender ? 'primary' : ''"
              style="height: auto; white-space: normal; font-size: 14px; padding: 6px"
              max-width="50px"
              class=""
            >
              {{ message.content }}
            </v-chip>
            <!-- <v-list-item-content
            :class="message.isSender ? 'text-right align-self-start' : ''"
          >
            <v-chip style="height:auto;white-space: normal; font-size: 16px;" max-width="50px" class="">
              {{ message.content }}
            </v-chip>
          </v-list-item-content> -->
          </v-list-item>
        </v-list>
        <!-- </v-card-text> -->
      </v-card>
      <v-card>
        <v-text-field
          placeholder="发送信息"
          filled
          dense
          style="padding: 10px; font-size: 13px"
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
  margin: 0 !important;
}
</style>
