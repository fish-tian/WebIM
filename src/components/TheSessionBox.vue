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
        min-height="496px"
        max-height="496px"
        class="overflow-y-auto fill-height"
      >
        <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>
        <v-list-item-group :value="model" mandatory>
          <v-list-item style="display: none"></v-list-item>
          <v-list-item
            v-for="session in orderSession"
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
            <v-list-item-content >
              <v-list-item-title style="font-weight: normal;"> {{ session.title }} </v-list-item-title>
              <v-list-item-subtitle style="font-weight: normal;">
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
import _ from "lodash"
import eventBus from '@/eventBus.js'
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
    // 对会话进行按照时间的排序
    orderSession: function() {
      let data = _.orderBy(this.storeState.sessions, 'lastdate', 'desc');
      return data;
    },
    lastmessage: function () {
      //storeState; chuli; sid -> lastmessage ;return {};
      let messages = this.storeState.messages;
      let errMessages = this.storeState.unfinishedMessages;
      // let msg = [];
      let msgHash = {};
      let isMe = {};
      let redDotHash = {};
      let res = []; //第一个是msg,第二个是红点，第三个是判断是不是自己
      //console.log("messages-------");
      //console.log(messages);
      //console.log("errmessages-------");
      //console.log(errMessages.length);//0
      for (const item of messages) {
        //console.log(item);
        //item代表一个会话
        if (item.messages.length === 0) {
          msgHash[item.sid] = null;
          redDotHash[item.sid] = null;
          isMe[item.sid] = null;
        } else {
          // msg.push({
          //   sid: item.sid,
          //   message: item.messages[item.messages.length - 1].message,
          // });
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
            // msg.push({
            //   sid: item.sid,
            //   message: item.messages[item.messages.length - 1].message,
            // });
            msgHash[item.sid] = item.messages[item.messages.length - 1].message;
            redDotHash[item.sid] = 0;
          }
        }
      }

      res.push(msgHash);
      res.push(redDotHash);
      return res;
    },
    flag: function () {
      return this.storeState.flag;
    },
  },
  async mounted() {
    //await this.getAllSessions();
  },
  methods: {
    currSIdChange() {
      eventBus.$emit('sidChanged');
    },
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
    openChat(sid) {
      this.currSIdChange();

      store.setCurrSId(sid);
      //this.updateRead(sid);
      
    },
    //更新发送消息状态
    //updateRead(sid) {
      // const data = {
      //   message: "",
      //   sid: sid,
      // };
      // this.message = "";
      // axios.post("/api/message/updateRead", data).then((res) => {
      //   if (res.data.success) {
      //     setTimeout(() => {
      //       // 发送成功就获取所有消息
      //       // this.getAllMessages(sid);
      //       console.log("更新状态消息发送---");
      //     }, 1000);
      //   }
      // });
    //},
  },
};
</script>


