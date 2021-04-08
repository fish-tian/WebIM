<template>
  <!-- v-card 里是联系人卡片 -->
  <v-card v-if="storeState.show[0]" tile>
    <v-card-text>会话</v-card-text>

    <v-card tile>
      <v-list
        subheader
        dense
        max-width="250px"
        min-width="250px"
        min-height="456px"
        max-height="456px"
        class="overflow-y-auto fill-height"
      >
        <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>
        <v-list-item-group :value="model" mandatory>
          <v-list-item style="display: none"></v-list-item>
          <v-list-item
            v-for="session in storeState.sessions"
            :key="session.sid"
            @click="openChat(session.sid)"
          >
            <v-list-item-avatar>
              <!-- 小红点的逻辑是：如果不是自己发的，而且消息没有读。那么显示小红点    :value="dotshow"-->
              <v-badge
                left
                dot
                bottom
                bordered
                overlap
                color="red"
                offset-x="15"
                offset-y="10"
                :value="lastmessage[1][session.sid]"
              >
                <v-avatar color="orange" size="36" v-if="!session.group">
                  <span class="white--text headline">{{
                    session.title[0]
                  }}</span>
                </v-avatar>
                <v-avatar color="red" size="36" v-if="session.group">
                  <span class="white--text headline">{{
                    session.title[0]
                  }}</span>
                </v-avatar>
              </v-badge>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title> {{ session.title }} </v-list-item-title>
              <v-list-item-subtitle>
                {{ lastmessage[0][session.sid] }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
import store from "@/store.js";
import axios from "axios";
// 解决跨域
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      storeState: store.state,
      lists: "",
      alert: false,
      alertMessage: "",
      alertType: "",
    };
  },
  computed: {
    model: function () {
      return 0;
    },
    lastmessage: function () {
      //storeState; chuli; sid -> lastmessage ;return {};
      let messages = this.storeState.messages;
      let errMessages = this.storeState.unfinishedMessages;
      let msgHash = {};
      let isMe = {};
      let redDotHash = {};
      let res = []; //第一个是msg,第二个是红点，第三个是判断是不是自己
      //console.log("messages-------");
      //console.log(messages);
      //console.log("errmessages-------");
      //console.log(errMessages.length);//0
      for (const item of messages) {
        //item代表一个会话
        if (item.messages.length === 0) {
          msgHash[item.sid] = null;
          redDotHash[item.sid] = null;
          isMe[item.sid] = null;
        } else {
          msgHash[item.sid] = item.messages[item.messages.length - 1].message;
          redDotHash[item.sid] =
            !item.messages[item.messages.length - 1].read &&
            !item.messages[item.messages.length - 1].isMe &&
            item.sid !== this.storeState.currSId;
          //console.log("");
          //console.log(redDotHash[item.sid]);
        }
      }
      for (const item of errMessages) {
        if (item.messages.length !== 0) {
          let dataErr = item.messages[item.messages.length - 1].date;
          let dateMes = item.messages[item.messages.length - 1].date;
          if (dataErr > dateMes) {
            msgHash[item.sid] = item.messages[item.messages.length - 1].message;
            redDotHash[item.sid] = 0;
          }
        }
      }
      res.push(msgHash);

      res.push(redDotHash);
      //res.push(isMe);
      //console.log("小红点：");
      //console.log(res);

      return res;
    },
    flag: function () {
      return this.storeState.flag;
    },
  },
  async mounted() {
    let temp = await this.getAllSessions();
    console.log(temp);
    //this.openChat(this.storeState.friends[0]);
  },
  methods: {
    //显示提示
    showAlert(alertMessage, alertType) {
      this.alert = true;
      this.alertMessage = alertMessage;
      this.alertType = alertType;

      setTimeout(() => {
        this.alert = false;
      }, 3000);
    },
    // 点击聊天按钮
    //flag=1:不显示小红点,0显示.没点聊天之前是underdine

    // 需要修改！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！

    openChat(sid) {
      console.log(sid);
      //store.setCurrFriendId(friend.id);
      store.setCurrSId(sid);
      this.getAllMessages(sid);
      //store.setFlag(1);
    },
    // 获取某个会话的所有聊天消息
    getAllMessages(sid) {
      let data = {
        sid: sid,
      };

      //console.log(data);
      axios
        .post("/api/message/getAll", data)
        .then((res) => {
          if (res.data.success) {
            store.setMessages(sid, res.data.info);
          } else {
            // this.showAlert(res.data.info, "error");
            // console.log(res.data.info);
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          console.log(err);
        });
    },
    //获取所有会话
    async getAllSessions() {
      // 如果 cookie 中有 session，就请求获取好友列表
      if (this.$cookies.get("koa.sess")) {
        axios
          .get("/api/session/getAll")
          .then((res) => {
            if (res.data.success) {
              store.setSessions(res.data.info);
              for (const session of res.data.info) {
                this.getAllMessages(session.sid);
              }

              //this.lists = res.data.lists;
            } else {
              store.setFriends(null);
            }
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
  },
};
</script>
