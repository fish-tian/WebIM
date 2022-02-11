<template>
  <div class="d-flex">
    <!--  -->
    <v-card v-if="!this.$store.state.currSId" tile color="grey lighten-4">
      <v-card-text> 选择好友进行聊天吧！ </v-card-text>

      <div>
        <!-- v-card 里是对话框卡片 -->
        <v-card
          min-width="550px"
          min-height="526px"
          max-height="526px"
          class="overflow-y-auto fill-height"
          tile
          color="grey lighten-4"
        >
        </v-card>
      </div>
    </v-card>
    <v-card v-if="this.$store.state.currSId" tile color="grey lighten-4" @mousedown="setFocus">
      <v-card-text>
        {{ title }}
        <v-btn dense v-show="groupMembers" icon x-small @click="showMembers">
          <v-icon dense> mdi-dots-horizontal </v-icon>
        </v-btn>
      </v-card-text>
      <!-- 群成员：{{showMembers.join('、')}} -->

      <div>
        <!-- v-card 里是对话框卡片 -->
        <v-card
          min-width="550px"
          min-height="380px"
          max-height="380px"
          class="overflow-y-auto fill-height"
          tile
          style="padding: 8px"
          @wheel="onWheel"
          id="card"
        >
          <v-list subheader dense>
            <div class="text-center" v-show="scrollTimeout">
              <v-progress-circular
                :size="16"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            <v-list-item
              v-for="message in messages.slice(start)"
              :key="message.mid"
              :class="{ 'text-right align-self-start': message.isMe }"
              class="flex-wrap"
            >
              <!-- 显示时间 -->
              <div
                v-show="times[message.mid]"
                style="
                  flex-basis: 550px;
                  font-size: 13px;
                  text-align: center !important;
                  padding: 10px;
                  color: rgba(0, 0, 0, 0.6);
                "
                class="text-left"
              >
                {{ times[message.mid] }}
              </div>
              <!-- 消息状态：未读、已读、发送中 -->
              <div
                style="
                  flex: 1 1 auto;
                  font-size: 13px;
                  color: rgba(0, 0, 0, 0.6);
                  padding: 5px;
                "
                v-show="message.isMe"
              >
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
                <div
                  v-show="message.read === 2 && message.isMe && isGroup === 0"
                  style="margin-top: 3px"
                >
                  发送中
                </div>
              </div>
              <!-- 头像 -->
              <v-list-item-avatar v-if="!message.isMe" class="mr-1">
                <v-avatar color="orange" size="36">
                  <span class="white--text headline">{{
                    message.sender_name[0]
                  }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <!-- 气泡 -->
              <v-list-item-content style="flex: 0 1 auto">
                <v-list-item-title v-if="!message.isMe">
                  {{ message.sender_name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  <v-chip
                    :color="message.isMe ? 'primary' : ''"
                    style="
                      height: auto;
                      max-width: 380px;
                      font-size: 14px;
                      padding: 7px 10px;
                      text-align: left !important; ;
                    "
                  >
                    <p
                      style="
                      max-width: 350px;
                      white-space: normal;
                      font-size: 14px;
                      margin: 0px !important 
                      padding: 7px 10px; 
                    "
                    >
                      {{ message.message }}
                    </p>
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-icon
                v-show="message.read === 3 && message.isMe && isGroup === 0"
                color="red"
                @click="resendMessage(unmessage)"
                >mdi-alert-circle
              </v-icon>
            </v-list-item>
            <!-- 应废弃 -->
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
                      padding: 7px 10px;
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

        <v-card
          tile
          style="max-height: 146px; min-height: 146px; overflow: hidden"
        >
          <!-- 表情 -->
          <div
            style="
              height: 27px;
              display: flex;
              overflow: hidden;
              padding: 8px 0px 0px 15px;
            "
          >
            <v-icon dense>mdi-emoticon-happy-outline</v-icon>
          </div>
          <!-- 聊天框 -->
          <div
            style="
              max-height: 89px;
              min-height: 89px;
              display: flex;
              overflow: hidden;
            "
          >
            <v-form ref="form" style="width: 100%">
              <v-textarea
                solo
                no-resize
                hide-details
                rows="3"
                style="font-size: 14px"
                @keyup.enter="sendMessage"
                v-model="message"
                @focus="handleOnfocus"
                id="textarea"
              ></v-textarea>
            </v-form>
          </div>
          <!-- 发送按钮 -->
          <div style="max-height: 27px; min-height: 27px; margin-left: 480px">
            <v-btn depressed small color="primary" @click="sendMessage">
              发送
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-card>

    <v-card v-if="showMembersFlag" tile color="grey lighten-4">
      <v-card-text> 群成员 </v-card-text>

      <div>
        <!-- v-card 里是对话框卡片 -->
        <v-card
          min-width="200px"
          min-height="526px"
          max-height="526px"
          class="overflow-y-auto fill-height"
          tile
        >
          <v-list dense>
            <v-list-item v-for="member in groupMembers" :key="member">
              <v-list-item-avatar class="mr-1">
                <v-avatar color="orange" size="28">
                  <span class="white--text headline">
                    {{ member[0] }}
                  </span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ member }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import eventBus from "@/eventBus.js";
import sharedMethods from "@/sharedMethods";

export default {
  data() {
    return {
      // friendId: this.$route.params.id,
      // userId: store.user.id
      // storeState: this.$store.state,
      sidChangedFlag: false,
      addUnfinishedMessageFlag: false,
      // end:store.state.msgNums,
      // start:store.state.msgNums-10,
      message: "",
      scrollTimeout: null,
      showMembersFlag: false,
    };
  },
  mounted() {
    // store.setK(0);
    this.$store.commit("setK", 0);
    //console.log("mounted!!!!!!!!!!!");
  },
  created() {
    eventBus.$on("sidChanged", () => {
      //alert("切换之前的");
      //一些操作，message就是从top组件传过来的值
      //console.log("");
      this.sidChangedFlag = true;
      //this.scrollToTop();
    });
  },
  updated() {
    if (this.sidChangedFlag) {
      this.showMembersFlag = false;
      this.sidChangedFlag = false;
      this.scrollToDown();
    }

    if (this.addUnfinishedMessageFlag) {
      this.addUnfinishedMessageFlag = false;
      this.scrollToDown();
    }
  },
  computed: {
    currSId: function () {
      return this.$store.state.currSId;
    },
    //查找每个会话开始显示消息的下标
    start: function () {
      let allMessages = this.$store.state.messages.find(
        (item) => item.sid === this.$store.state.currSId
      );
      return allMessages.start;
    },
    //查找当前会话是不是群聊
    isGroup: function () {
      return this.$store.state.sessions.find(
        (item) => item.sid === this.$store.state.currSId
      ).group;
    },

    title: function () {
      let session = this.$store.state.sessions.find(
        (item) => item.sid === this.$store.state.currSId
      );
      return session ? session.title : "";
    },
    groupMembers: function () {
      let allMembers = this.$store.state.members.find(
        (item) => item.sid === this.$store.state.currSId
      );
      console.log(allMembers);
      if (allMembers.members) {
        let res = [];
        for (const item of allMembers.members) {
          res.push(item.user_name);
        }
        return res;
      } else {
        return null;
      }
    },

    messages: function () {
      let allMessages = this.$store.state.messages.find(
        (item) => item.sid === this.$store.state.currSId
      );

      //this.updateRead();
      return allMessages === undefined ? [] : allMessages.messages;
    },

    // 设置每条消息的时间是否显示
    times: function () {
      let allMessages = this.$store.state.messages.find(
        (item) => item.sid === this.$store.state.currSId
      );
      console.log(allMessages);
      if (allMessages === undefined || allMessages.messages.length === 0) {
        return {};
      }
      allMessages = allMessages.messages;
      //使用双指针，preIndex 指向上一个设置时间的消息，currIndex 指向当前遍历的消息
      let preDate = new Date(allMessages[0].date);
      let res = {};
      res[allMessages[0].mid] = this.createDate(preDate);
      let tenMin = 1000 * 60 * 10;
      for (
        let currIndex = 1, len = allMessages.length;
        currIndex < len;
        currIndex++
      ) {
        let currDate = new Date(allMessages[currIndex].date);
        //console.log(currDate);
        if (currDate - preDate > tenMin) {
          res[allMessages[currIndex].mid] = this.createDate(currDate);
          preDate = currDate;
        } else {
          res[allMessages[currIndex].mid] = null;
        }
      }
      return res;
    },

    unfinishedMessages: function () {
      let unmessages = this.$store.state.unfinishedMessages.find(
        (item) => item.sid === this.$store.state.currSId
      );
      return unmessages === undefined ? null : unmessages.messages;
    },
  },
  methods: {
    setFocus(e) {
      e.preventDefault();
      document.getElementById('textarea').focus();
    },
    handleOnfocus() {
      console.log(1);
    },
    showMembers() {
      this.showMembersFlag = !this.showMembersFlag;
    },
    // 处理一下正确的时间
    createDate(originDate) {
      let [year, month, day] = originDate.toLocaleDateString().split("/");
      let [hour, minute, second] = originDate.toLocaleTimeString().split(/:| /);
      return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
    },
    // 发送消息
    sendMessage() {
      if (this.message.trim()) {
        //console.log("before:" + this.message);
        const data = {
          message: this.message,
          sid: this.$store.state.currSId,
        };
        this.$refs.form.reset();
        this.message = "";

        //console.log("after:" + this.message);
        this.addUnfinishedMessageFlag = true;

        this.$store.commit("addUnfinishedMessage", {
          sid: data.sid,
          message: data.message,
        });

        let index = this.$store.state.unfinishedMessages.findIndex((item) => {
          return data.sid === item.sid;
        });
        const currMid = this.$store.state.unfinishedMessages[index].mid;

        //console.log("unmessage is:\n");
        //console.log(unmessage);
        axios
          .post("/api/message/sendMessage", data)
          .then((res) => {
            if (res.data.success) {
              setTimeout(() => {
                // 发送成功就在未完成消息中清除掉
                // store.clearUnfinishedMessage(data.sid, currMid);
                this.$store.commit("clearUnfinishedMessage", {
                  sid: data.sid,
                  mid: currMid,
                });

                // 发送成功就获取所有消息
                sharedMethods.getMessage
                  .call(this, data.sid)
                  .then((res) => {
                    // store.setMessages(data.sid, res.data.info);
                    this.$store.commit("setMessages", {
                      sid: data.sid,
                      messages: res.data.info,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }, 500);
            } else {
              // 将未完成消息设置为失败消息
              // store.resetUnfinishedMessage(data.sid, currMid);
              this.$store.commit("resetUnfinishedMessage", {
                sid: data.sid,
                mid: currMid,
              });
            }
          })
          .catch((err) => {
            this.$store.commit("resetUnfinishedMessage", {
              sid: data.sid,
              mid: currMid,
            });
            console.log(err);
          });
      }
    },

    // 在切换 chatbox 之后，将滑动条滑到最下面
    scrollToDown() {
      let card = document.getElementById("card");
      if (card && card.offsetHeight !== card.scrollHeight) {
        //console.log("滑动到最下面");
        //console.log("scrollHeight: " + card.scrollHeight);
        //console.log("offsetHeight：" + card.offsetHeight);
        card.scrollTop = card.scrollHeight - card.offsetHeight;
        //console.log("scrollTop：" + card.scrollTop);
      }
    },
    // 在切换 chatbox 之前，将滑动条滑到最上面
    scrollToTop() {
      let card = document.getElementById("card");
      if (card && card.offsetHeight !== card.scrollHeight) {
        //console.log("滑动到最上面");
        card.scrollTop = 0;
        //console.log(card.scrollTop);
      }
    },
    // 滑动鼠标事件，做了节流处理
    onWheel(event) {
      console.log("#event", event);
      let card = document.getElementById("card");
      if (
        card &&
        card.scrollTop === 0 &&
        // card.offsetHeight !== card.scrollHeight
        event.wheelDeltaY > 0
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
      // let len = allMessages.messages.length;
      // store.updateMsg(this.$store.state.currSId);
      this.$store.commit("updateMsg", this.$store.state.currSId);
      // let allMessages = this.storeState.messages.find(
      //   (item) => item.sid === sid
      // );
      //console.log("加载更多会话ID----" + sid + "开始下标" + allMessages.start);
    },
    // 点击红叹号，重发消息
    resendMessage(message) {
      const data = {
        message: message.message,
        sid: this.$store.state.currSId,
      };

      // store.resetUnfinishedMessage(data.sid, message.mid);
      this.$store.commit("resetUnfinishedMessage", {
        sid: data.sid,
        mid: message.mid,
      });
      axios
        .post("/api/message/sendMessage", data)
        .then((res) => {
          if (res.data.success) {
            setTimeout(() => {
              // 发送成功就在未完成消息中清除掉
              // store.clearUnfinishedMessage(data.sid, message.mid);
              this.$store.commit("clearUnfinishedMessage", {
                sid: data.sid,
                mid: message.mid,
              });
              // 发送成功就获取所有消息
              sharedMethods.getMessage.call(this, data.sid);
            }, 1000);
          } else {
            // 将未完成消息设置为失败消息
            // store.resetUnfinishedMessage(data.sid, message.mid);
            this.$store.commit("resetUnfinishedMessage", {
              sid: data.sid,
              mid: message.mid,
            });
          }
        })
        .catch((err) => {
          // store.resetUnfinishedMessage(data.sid, message.mid);
          this.$store.commit("resetUnfinishedMessage", {
            sid: data.sid,
            mid: message.mid,
          });
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
