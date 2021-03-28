<template>
  <div>
    <div class="g-Ue-v0h5Oe" v-if="!storeState.currFriendId">
      <div class="g-Ue-T-R">
        <div>
          <div class="g-Ue-ma">你好！</div>
          <div class="g-Ue-zr-ma">选择好友进行聊天吧！</div>
        </div>
      </div>
    </div>
    <v-card v-if="storeState.currFriendId">
      <v-card-text>聊天</v-card-text>
      <div>
        <!-- v-card 里是对话框卡片 -->
        <v-card
          min-width="800px"
          min-height="380px"
          max-height="380px"
          class="overflow-y-auto fill-height"
          outlined
          tile
          elevation="3"
        >
          <v-list subheader dense>
            <v-list-item ></v-list-item>
            <v-list-item
              v-for="message in storeState.messages"
              :key="message.mId"
              :class="{ 'd-flex flex-row-reverse': message.isMe }"
            >
              <v-chip
                :color="message.isMe ? 'primary' : ''"
                style="
                  height: auto;
                  white-space: normal;
                  font-size: 14px;
                  padding: 6px;
                "
                max-width="50px"
                class=""
              >
                {{ message.message }}
              </v-chip>
            </v-list-item>

            <v-list-item
              v-for="unmessage in unfinishedMessages"
              :key="unmessage.mid"
              :class="{ 'd-flex flex-row-reverse': 1 }"
            >
              <v-chip
                :color="1 ? 'primary' : ''"
                style="
                  height: auto;
                  white-space: normal;
                  font-size: 14px;
                  padding: 6px;
                "
                max-width="50px"
                class=""
              >
                {{ unmessage.message }}
              </v-chip>
              <v-subheader v-if="!unmessage.fail">发送中</v-subheader>
              <v-icon v-if="unmessage.fail" color="red" @click="resendMessage(unmessage)">mdi-alert-circle</v-icon>
            </v-list-item>
          </v-list>
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
      
      message: "",
    };
  },
  computed: {
    unfinishedMessages: function () {
      //console.log("unfinishedMessages is:\n");
      //console.log(this.storeState.unfinishedMessages.find(item => item.sid === this.storeState.currSId));
      let unmessages = this.storeState.unfinishedMessages.find(
        (item) => item.sid === this.storeState.currSId
      );
      return unmessages === undefined ? null : unmessages.messages;
    },
  },
  methods: {
    // 获取所有消息
    getMessage() {
      const theFriend = this.storeState.friends.find((friend) => {
        return friend.id == this.storeState.currFriendId;
      });

      let data = {
        friend: theFriend,
        sid: theFriend.sid,
      };
      axios
        .post("/api/sgMessage/getAll", data)
        .then((res) => {
          if (res.data.success) {
            store.setMessages(res.data.info);
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
      console.log(this.message);

      const theFriend = this.storeState.friends.find((friend) => {
        return friend.id == this.storeState.currFriendId;
      });
      const data = {
        message: this.message,
        friend: theFriend,
        sid: theFriend.sid,
      };

      this.message = "";
      let unmessage = store.addUnfinishedMessage(data.sid, data.message);
      console.log("unmessage is:\n");
      console.log(unmessage);
      axios
        .post("/api/sgMessage/sendMessage", data)
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
        .post("/api/sgMessage/sendMessage", data)
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
