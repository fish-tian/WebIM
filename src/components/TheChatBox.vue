<template>
  <div>
    <!--  -->
    <v-card v-if="!storeState.currSId" tile color="grey lighten-4">
      <v-card-text> 选择好友进行聊天吧！ </v-card-text>

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
        <!-- <v-card
          min-width="550px"
          min-height="380px"
          max-height="380px"
          class="overflow-y-auto fill-height"
          tile
          color="grey lighten-4"
          style="padding: 8px"
          v-scroll.self="onScroll"
          id="card"
        > -->
        <v-card
          min-width="550px"
          min-height="380px"
          max-height="380px"
          class="overflow-y-auto fill-height"
          tile
          color="grey lighten-4"
          style="padding: 8px"
          @wheel="onWheel"
          id="card"
        >
          <v-list subheader dense color="grey lighten-4">
            <div class="text-center" v-show="scrollTimeout">
              <v-progress-circular
                :size="16"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            <!-- <v-list-item
              v-for="message in messages.slice(start)"
              :key="message.mId"
              :class="{ 'text-right align-self-start': message.isMe }"
            > -->
            <v-list-item
              v-for="message in messages.slice(start)"
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
                  <div
                    v-show="message.read === 0 && message.isMe && isGroup === 0"
                    style="margin-top: 3px"
                  >
                    未读
                  </div>
                  <div
                    v-show="message.read === 1 && message.isMe && isGroup === 0"
                    style="margin-top: 3px"
                  >
                    已读
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <!-- <div v-show="message.read === 0 && message.isMe && isGroup === 0">
                未读
              </div>
              <div v-show="message.read === 1 && message.isMe && isGroup === 0">
                已读
              </div> -->
              <!-- <v-subheader
                v-show="message.read === 0 && message.isMe && isGroup === 0"
                >未读</v-subheader>
              <v-subheader
                v-show="message.read === 1 && message.isMe && isGroup === 0"
                >已读</v-subheader> -->
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
                  <div v-show="!unmessage.fail" style="margin-top: 3px">
                  发送中
                </div>
                </v-list-item-subtitle>
              </v-list-item-content>

              <!-- <v-subheader v-show="!unmessage.fail">发送中</v-subheader> -->
              <v-icon
                v-show="unmessage.fail"
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
import eventBus from "@/eventBus.js";
import sharedMethods from "@/sharedMethods";

export default {
  data() {
    return {
      // friendId: this.$route.params.id,
      // userId: store.user.id
      storeState: store.state,
      sidChangedFlag: false,
      addUnfinishedMessageFlag: false,
      // end:store.state.msgNums,
      // start:store.state.msgNums-10,
      message: "",
      scrollTimeout: null,
    };
  },
  mounted() {
    store.setK(0);
    //console.log("mounted!!!!!!!!!!!");
  },
  created() {
    eventBus.$on("sidChanged", () => {
      //alert("切换之前的");
      //一些操作，message就是从top组件传过来的值
      console.log("");
      this.sidChangedFlag = true;
      //this.scrollToTop();
    });
  },
  updated() {
    if (this.sidChangedFlag) {
      this.sidChangedFlag = false;
      this.scrollToDown();
    }

    if(this.addUnfinishedMessageFlag) {
      this.addUnfinishedMessageFlag = false;
      this.scrollToDown();
    }
  },
  computed: {
    currSId: function () {
      return store.storeState.currSId;
    },
    //查找每个会话开始显示消息的下标
    start: function () {
      let allMessages = this.storeState.messages.find(
        (item) => item.sid === this.storeState.currSId
      );
      return allMessages.start;
    },
    //查找当前会话是不是群聊
    isGroup: function () {
      return this.storeState.sessions.find(
        (item) => item.sid === this.storeState.currSId
      ).group;
    },

    title: function () {
      let session = this.storeState.sessions.find(
        (item) => item.sid === this.storeState.currSId
      );
      return session ? session.title : "";
    },

    messages: function () {
      let allMessages = this.storeState.messages.find(
        (item) => item.sid === this.storeState.currSId
      );

      //this.updateRead();

      return allMessages === undefined ? null : allMessages.messages;
    },

    unfinishedMessages: function () {
      let unmessages = this.storeState.unfinishedMessages.find(
        (item) => item.sid === this.storeState.currSId
      );
      return unmessages === undefined ? null : unmessages.messages;
    },
  },
  methods: {
    // 发送消息
    sendMessage() {
      const data = {
        message: this.message,
        sid: this.storeState.currSId,
      };
      this.message = "";

      this.addUnfinishedMessageFlag = true;
      let unmessage = store.addUnfinishedMessage(data.sid, data.message);
      
      //console.log("unmessage is:\n");
      //console.log(unmessage);
      axios
        .post("/api/message/sendMessage", data)
        .then((res) => {
          if (res.data.success) {
            setTimeout(() => {
              // 发送成功就在未完成消息中清除掉
              store.clearUnfinishedMessage(data.sid, unmessage.mid);
              // 发送成功就获取所有消息
              sharedMethods.getMessage
                .call(this, data.sid)
                .then((res) => {
                  store.setMessages(data.sid, res.data.info);
                })
                .catch((err) => {
                  console.log(err);
                });
            }, 500);
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

    // 在切换 chatbox 之后，将滑动条滑到最下面
    scrollToDown() {
      let card = document.getElementById("card");
      if (card && card.offsetHeight !== card.scrollHeight) {
        console.log("滑动到最下面");
        console.log("scrollHeight: " + card.scrollHeight);
        console.log("offsetHeight：" + card.offsetHeight);
        card.scrollTop = card.scrollHeight - card.offsetHeight;
        console.log("scrollTop：" + card.scrollTop);
      }
    },
    // 在切换 chatbox 之前，将滑动条滑到最上面
    scrollToTop() {
      let card = document.getElementById("card");
      if (card && card.offsetHeight !== card.scrollHeight) {
        console.log("滑动到最上面");
        card.scrollTop = 0;
        console.log(card.scrollTop);
      }
    },
    // 滑动鼠标事件，做了节流处理
    onWheel() {
      let card = document.getElementById("card");
      if (
        card &&
        card.scrollTop === 0 &&
        card.offsetHeight !== card.scrollHeight
      ) {
        if (!this.scrollTimeout) {
          // 当前没有定时器要执行
          this.scrollTimeout = setTimeout(() => {
            this.onloadMore();
            this.scrollTimeout = null;
          }, 1500);
        }
      }
    },
    //加载更多的消息
    onloadMore() {
      let sid = this.storeState.currSId;

      // let len = allMessages.messages.length;
      store.updateMsg(this.storeState.currSId);
      let allMessages = this.storeState.messages.find(
        (item) => item.sid === sid
      );

      console.log("加载更多会话ID----" + sid + "开始下标" + allMessages.start);
    },
    // 点击红叹号，重发消息
    resendMessage(message) {
      const data = {
        message: message.message,
        sid: this.storeState.currSId,
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
              sharedMethods.getMessage.call(this, data.sid);
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
