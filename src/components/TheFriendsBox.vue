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
        max-height="800px"
      >
        <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>
        <v-list-item-group v-model="model" mandatory>
          <v-list-item style="display: none;"></v-list-item>
          <v-list-item
            v-for="friend in storeState.friends"
            :key="friend.id"
            @click="openChat(friend)"
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
                :value="lastmessage[1][friend.sid]"
              >
                <v-avatar color="orange" size="36">
                  <span class="white--text headline">{{
                    friend.user_name[0]
                  }}</span>
                </v-avatar>
              </v-badge>
            </v-list-item-avatar>
            <!-- <v-badge left dot bottom bordered offset-x="-20"> -->
            <v-list-item-content>
              <v-list-item-title> {{ friend.user_name }} </v-list-item-title>
              <v-list-item-subtitle>
                {{ lastmessage[0][friend.sid] }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <!-- </v-badge> -->

            <!-- <v-list-item-action>
            <v-btn icon @click="openChat(friend)">
              <v-icon color="green">mdi-message</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon @click="delFriend(friend.fid)">
              <v-icon color="red">mdi-close-circle</v-icon>
            </v-btn>
          </v-list-item-action> -->

            <!-- <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay> -->
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
      model: 0,
    };
  },
  computed: {
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
          console.log("");
          console.log(redDotHash[item.sid]);
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
    let temp = await this.getAllFriends();
    console.log(temp);
    this.openChat(this.storeState.friends[0]);
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
    // 删除好友
    delFriend(fid) {
      let data = { fid };
      axios
        .post("/api/friend/delFriend", data)
        .then((res) => {
          if (res.data.success) {
            this.showAlert("成功删除好友！", "success");
            this.getAllFriends();
          } else {
            this.showAlert(res.data.info, "error");
            // console.log(res.data.info);
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          //this.showAlert(err, "error");
          console.log(err);
        });
    },
    // 点击聊天按钮
    //flag=1:不显示小红点,0显示.没点聊天之前是underdine
    openChat(friend) {
      //console.log( friend.sid + "--" + store.state.currSId + "--" + store.state.flag);
      if (this.storeState.currSId === undefined) {
        //点击第一个会话，不显示红点
        store.setFlag(1);
      } else if (friend.sid !== this.storeState.currSId) {
        //点击不同会话，显示红点
        store.setFlag(0);
        // console.log(
        //   "点击之后" +
        //     friend.sid +
        //     "--" +
        //     store.state.currSId +
        //     "--" +
        //     store.state.flag
        // );
      } else {
        store.setFlag(1);
      }
      store.setCurrFriendId(friend.id);
      store.setCurrSId(friend.sid);
      this.getAllMessages(friend);
      //store.setFlag(1);
    },
    // 获取和某一个好友的聊天消息
    getAllMessages(friend) {
      //this.isShow=false;
      let data = {
        friend: friend,
        sid: friend.sid,
      };

      //console.log(data);
      axios
        .post("/api/sgMessage/getAll", data)
        .then((res) => {
          if (res.data.success) {
            store.setMessages(friend.sid, res.data.info);
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
    //获取所有好友
    async getAllFriends() {
      // 如果 cookie 中有 session，就请求获取好友列表
      if (this.$cookies.get("koa.sess")) {
        axios
          .get("/api/friend/getAll")
          .then((res) => {
            if (res.data.success) {
              //console.log(res.data.info[0].message);
              store.setFriends(res.data.info);
              for (const friend of res.data.info) {
                this.getAllMessages(friend);
              }
              // store.setMessage(res.data.message);
              //this.friends = res.data.info;
              this.lists = res.data.lists;
              //console.log(this.friends);
              //console.log(this.lists);
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
