<template>
  <div>
    <!-- <div class="g-Ue-v0h5Oe" v-if="!storeState.currFriendId">
      <div class="g-Ue-T-R">
        <div>
          <div class="g-Ue-ma">你好！</div>
          <div class="g-Ue-zr-ma">选择好友进行聊天吧！</div>
        </div>
      </div>
    </div> -->
    <v-card v-if="!storeState.currSId" tile color="grey lighten-4">
      <v-card-text> 选择好友进行聊天吧！ </v-card-text>
      <!-- <div class="g-Ue-v0h5Oe" min-width="650px"
          min-height="380px"
          max-height="380px">
      <div class="g-Ue-T-R">
        <div>
          <div class="g-Ue-ma">你好！</div>
          <div class="g-Ue-zr-ma">选择好友进行聊天吧！</div>
        </div>
      </div>
    </div> -->
      <div>
        <!-- v-card 里是对话框卡片 -->
        <v-card
          min-width="550px"
          min-height="456px"
          max-height="456px"
          class="overflow-y-auto fill-height"
          tile
          color="grey lighten-4"
        >
        </v-card>
      </div>
    </v-card>
    <v-card v-if="storeState.currSId" tile color="grey lighten-4">
      <v-card-text>{{ title }}</v-card-text>

      <div>
        <!-- v-card 里是对话框卡片 -->
        <v-card
          min-width="550px"
          min-height="380px"
          max-height="380px"
          class="overflow-y-auto fill-height"
          tile
          color="grey lighten-4"
          style="padding: 8px"
        >
          <v-list subheader dense color="grey lighten-4">
            <v-list-item-title>
              点击加载更多<v-icon @click="onloadMore()">mdi-update</v-icon>
            </v-list-item-title>
            <v-list-item
              v-for="message in messages.slice(msgStart)"
              :key="message.mId"
              :class="{ 'text-right align-self-start': message.isMe }"
            >
              <v-list-item-avatar v-if="!message.isMe" class="mr-1">
                <v-avatar color="orange" size="36">
                  <span class="white--text headline">{{
                    message.sender_name[0]
                  }}</span>
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-if="!message.isMe">
                  {{ message.sender_name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  <v-chip
                    :color="message.isMe ? 'primary' : ''"
                    style="
                      height: auto;
                      max-width: 300px;
                      white-space: normal;
                      font-size: 14px;
                      padding: 5px;
                    "
                  >
                    {{ message.message }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-subheader
                v-if="message.read === 0 && message.isMe && isGroup === 0"
                >未读</v-subheader
              >
              <v-subheader
                v-if="message.read === 1 && message.isMe && isGroup === 0"
                >已读</v-subheader
              >
            </v-list-item>

            <v-list-item
              v-for="unmessage in unfinishedMessages"
              :key="unmessage.mid"
              :class="{ 'text-right align-self-start': 1 }"
            >
              <v-list-item-avatar v-if="0">
                <v-avatar color="orange" size="36">
                  <span class="white--text headline">{{
                    message.sender_name[0]
                  }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-if="0">
                  {{ message.sender_name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    :color="1 ? 'primary' : ''"
                    style="
                      height: auto;
                      max-width: 300px;
                      white-space: normal;
                      font-size: 14px;
                      padding: 5px;
                    "
                  >
                    {{ unmessage.message }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-subheader v-if="!unmessage.fail">发送中</v-subheader>
              <v-icon
                v-if="unmessage.fail"
                color="red"
                @click="resendMessage(unmessage)"
                >mdi-alert-circle</v-icon
              >
            </v-list-item>
          </v-list>
        </v-card>
        <v-card tile>
          <v-text-field
            placeholder="发送信息"
            filled
            dense
            style="padding: 10px 5px 0px 10px; font-size: 13px"
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
    </v-card>
  </div>
</template>

<script>
import store from "@/store.js";
import axios from "axios";

export default {
  data() {
    return {
      // friendId: this.$route.params.id,
      // userId: store.user.id
      storeState: store.state,
      // end:store.state.msgNums,
      // start:store.state.msgNums-10,
      message: "",
    };
  },
  mounted() {
    store.setK(0);
  },
  computed: {
    //查找当前会话是不是群聊
    isGroup: function() {
      return this.storeState.sessions.find(
        (item) => item.sid === this.storeState.currSId
      ).group;
    },

    title: function() {
      return this.storeState.sessions.find(
        (item) => item.sid === this.storeState.currSId
      ).title;
    },

    messages: function() {
      let allMessages = this.storeState.messages.find(
        (item) => item.sid === this.storeState.currSId
      );
      let len = allMessages.messages.length;
      console.log("会话消息------：");
      console.log(allMessages);
      //初始化：
      store.setMsgNums(len);
      // store.setK(0);
      //store.setMsgStart(len-10);
      console.log(
        "初始化->调用方法的次数" +
          this.storeState.k +
          "消息总数：" +
          this.storeState.msgNums
      );

      return allMessages === undefined ? null : allMessages.messages;
    },
    // msgNums: function() {
    //   console.log("会话消息总数：---" + this.storeState.msgNums);
    //   return this.storeState.msgNums;
    // },
    msgStart: function() {
      if (this.storeState.msgNums < 10) {
        var start = 0;
      } else {
        start = this.storeState.msgNums - (this.storeState.k + 1) * 10;
      }
      if (start < 0) start = 0;
      console.log("会话开始start:" + start);
      return start;
      //return this.storeState.msgStart;
    },
    unfinishedMessages: function() {
      let unmessages = this.storeState.unfinishedMessages.find(
        (item) => item.sid === this.storeState.currSId
      );
      return unmessages === undefined ? null : unmessages.messages;
    },
  },
  methods: {
    //加载更多的消息
    onloadMore() {
      // console.log("加载更多消息->消息开始展示的下标"+this.storeState.msgStart+"消息总数："+this.storeState.msgNums);
      // let start=this.storeState.msgStart;
      // if(start<10){
      //    start=0;
      // }else{
      //   start=this.storeState.msgStart-10;
      // }
      // store.setMsgStart(start);
      // console.log("更新后的start："+this.storeState.msgStart);
      let k = this.storeState.k + 1;
      console.log(k);
      store.setK(k);
      console.log("K---" + this.storeState.k);
      //  if(this.storeState.msgNums<10){
      //     var start=0;
      //   }else{
      //     start=this.storeState.msgNums-(this.storeState.k+1)*10;
      //   }
      //   return start;
    },
    // 获取所有消息
    getMessage() {
      let data = {
        sid: this.storeState.currSId,
      };

      axios
        .post("/api/message/getAll", data)
        .then((res) => {
          if (res.data.success) {
            //console.log("res.data.info:\n");
            //console.log(res.data.info);
            store.setMessages(this.storeState.currSId, res.data.info);
          } else {
            // this.showAlert(res.data.info, "error");
            // console.log(res.data.info);
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          //this.showAlert(err, "error");
          console.log(err);
        });
    },
    // 发送消息
    sendMessage() {
      const data = {
        message: this.message,
        sid: this.storeState.currSId,
      };

      this.message = "";
      let unmessage = store.addUnfinishedMessage(data.sid, data.message);
      console.log("unmessage is:\n");
      console.log(unmessage);
      axios
        .post("/api/message/sendMessage", data)
        .then((res) => {
          if (res.data.success) {
            setTimeout(() => {
              // 发送成功就在未完成消息中清除掉
              store.clearUnfinishedMessage(data.sid, unmessage.mid);
              // 发送成功就获取所有消息
              this.getMessage();
            }, 1000);
          } else {
            // 将未完成消息设置为失败消息
            store.resetUnfinishedMessage(data.sid, unmessage.mid);
          }
        })
        .catch((err) => {
          store.resetUnfinishedMessage(data.sid, unmessage.mid);
          console.log(err);
        });
    },
    // 点击红叹号，重发消息
    resendMessage(message) {
      console.log("mid为" + message.mid);

      const theFriend = this.storeState.friends.find((friend) => {
        return friend.id == this.storeState.currFriendId;
      });
      const data = {
        message: message.message,
        friend: theFriend,
        sid: theFriend.sid,
      };

      store.resetUnfinishedMessage(data.sid, message.mid);

      axios
        .post("/api/message/sendMessage", data)
        .then((res) => {
          if (res.data.success) {
            setTimeout(() => {
              // 发送成功就在未完成消息中清除掉
              store.clearUnfinishedMessage(data.sid, message.mid);
              // 发送成功就获取所有消息
              this.getMessage();
            }, 1000);
          } else {
            // 将未完成消息设置为失败消息
            store.resetUnfinishedMessage(data.sid, message.mid);
          }
        })
        .catch((err) => {
          store.resetUnfinishedMessage(data.sid, message.mid);
          console.log(err);
        });
    },
  },
};
</script>

<style>
.v-input__append-outer {
  margin: 0 !important;
}
.g-Ue-ma {
  font-weight: 300;
  font-size: 45px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.g-Ue-zr-ma {
  font-size: 24px;
  font-weight: 300;
  margin-top: 8px;
  text-shadow: 0 2px 4px rgb(0 0 0 / 50%);
}
.g-Ue-v0h5Oe {
  color: #fff;
  display: table;
  top: 200px;
  min-width: "800px";
  min-height: "380px";
  max-height: "380px";
}
.g-Ue-T-R {
  display: table-row;
}
</style>
