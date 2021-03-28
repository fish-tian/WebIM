<template>
  <!-- v-card 里是联系人卡片 -->
  <v-card v-if="storeState.friendsOrRequest===0" max-width="350px" min-width="300px" max-height="800px">
      <v-card-text>联系人</v-card-text>
  <v-card >
    <v-list subheader dense >
      <v-alert :type="alertType" v-if="alert"> {{ alertMessage }} </v-alert>
      <v-list-item v-for="friend in storeState.friends" :key="friend.id">
        <v-list-item-avatar size="36px">
        <v-avatar color="orange" size="36">
      <span class="white--text headline">{{ friend.user_name[0] }}</span>
    </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> {{ friend.user_name }} </v-list-item-title>
          
        </v-list-item-content>
         
           <v-tab>
             {{lastmessage[0][friend.sid]}}
            <!-- 小红点的逻辑是：如果不是自己发的，而且消息没有读。那么显示小红点 -->
             <v-badge color="red" dot v-if="lastmessage[1][friend.sid]===0&&lastmessage[2][friend.sid]===false&&flag!==1"> </v-badge>
           </v-tab>
           
        
        <v-list-item-action>
          <v-btn icon @click="openChat(friend)">
            <v-icon color="green">mdi-message</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn icon @click="delFriend(friend.fid)">
            <v-icon color="red">mdi-close-circle</v-icon>
          </v-btn>
        </v-list-item-action>
        <!-- <v-overlay absolute :opacity="0.2" :value="hover"></v-overlay> -->
      </v-list-item>

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
      //localFriends: store.friends,
      //friends: store.friends,
      storeState: store.state,
      lists: "",
      alert: false,
      alertMessage: "",
      alertType: "",
      //isShow:true,
    };
  },
  computed: {
    lastmessage : function() {//storeState; chuli; sid -> lastmessage ;return {};
      let messages = this.storeState.messages;
      let errMessages = this.storeState.unfinishedMessages;
      let msgHash = {};
      let isMe={};
      let redDotHash={};
      let res=[];//第一个是msg,第二个是红点，第三个是判断是不是自己
      console.log("messages-------");
      console.log(messages);
      console.log("errmessages-------");
      //console.log(errMessages.length);//0
      for(const item of messages) {//item代表一个会话
        if(item.messages.length === 0) {
          msgHash[item.sid] = null;
          redDotHash[item.sid] = null;
          isMe[item.sid] = null;
        } else {
          msgHash[item.sid] = item.messages[item.messages.length - 1].message;
          redDotHash[item.sid] = item.messages[item.messages.length - 1].read;
          isMe[item.sid] = item.messages[item.messages.length - 1].isMe;
       
        }
      }
      for(const item of  errMessages) {
        if(item.messages.length !== 0) {
          let dataErr=item.messages[item.messages.length - 1].date;
          let dateMes=item.messages[item.messages.length - 1].date;
          if(dataErr>dateMes){
            msgHash[item.sid]=item.messages[item.messages.length - 1].message;
          }
        }
      }
      res.push(msgHash);
      
       res.push(redDotHash);
       res.push(isMe);
       console.log("小红点：");
       console.log(res);

       return res;
      
     
    },
    flag : function() {
    return this.storeState.Flag;

  }
    

  },
  mounted() {
    this.getAllFriends();
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
    openChat(friend) {
      if(friend.sid)
      store.setCurrFriendId(friend.id);
      store.setCurrSId(friend.sid);
      store.setFlag(1);
      console.log(friend.sid+"-----------==");
      console.log(store.state);
    },
    // 获取和某一个好友的聊天消息
    getAllMessages(friend) {
      //this.isShow=false;
      let data = {
        friend: friend,
        sid: friend.sid
      };
      
      console.log(data);
      axios
        .post('/api/sgMessage/getAll', data)
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
    getAllFriends() {
      // 如果 cookie 中有 session，就请求获取好友列表
      if (this.$cookies.get("koa.sess")) {
        axios
          .get("/api/friend/getAll")
          .then((res) => {
            if (res.data.success) {
              console.log(res.data.info[0].message);
              store.setFriends(res.data.info);
              for(const friend of res.data.info) {
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