<template>
  <div style="width: 100%; height: 100%; overflow: hidden">
    <span class="bg"></span>
    <v-app>
      <v-main>
        <!-- <Home/> -->
        <!-- 在主页和login页面切换 -->
        <router-view :key="$route.path" style="padding: 50px" />
      </v-main>
    </v-app>
  </div>
</template>

<script>
//import TheNavigation from '@/components/TheNavigation';
//import Home from './views/Home'
import store from "@/store.js";
import axios from "axios";
import sharedMethods from "@/sharedMethods"
import { io } from "socket.io-client";

// 解决跨域
axios.defaults.withCredentials = true;

export default {
  name: "App",
  components: {
    //TheNavigation
    // Login
    //Home
  },
  data() {
    return {
      storeState: store.state,
    };
  },
  created() {
    const options = { withCredentials: true };
    const socket = io('http://localhost:3001', options);
    socket.on('connect', () => {
      // Fired when the socket connects.
      console.log("socket id: " + this.$socket.id);
      store.setSocketId(this.$socket.id);
      this.keepAlive();
    });

    socket.on('connect_error', (err) => {
      console.log("socket.io 错误" );
      console.log(err);
      //this.connect();
    });

    socket.on('disconnect', () => {
      //alert("websocket连接出现错误，请刷新页面后重试");
    });

    socket.on('newRequest', (data) => {
      console.log("-- newrequest: \n" + data);
      store.setRequests(data);
    });

    socket.on('newFriend', (data) => {
      console.log("-- newfriend: \n" + data);
      store.setFriends(data);
    });

    socket.on('newMessage', (data) => {
      console.log("newMsg------");
      store.setMessages(data.sid, data.messages);
      console.log(this.storeState.currSId);
    
      if (this.storeState.currSId === data.sid) {
        this.getMessage();
      }
    });

    socket.on('newSession', () => {
      store.setSessions(data);
    });

    socket.on('lastMsg', () => {
      console.log("-- LastMessage: \n" + data);
      store.setlastMsg(data);
    });
  },
  mounted() {
    await this.getAllSessions();
  },
  methods: {
    // 获取所有消息
    getMessage() {
      // let data = {
      //   sid: this.storeState.currSId,
      // };
      // axios
      //   .post("/api/message/getAll", data)
      //   .then((res) => {
      //     if (res.data.success) {
      //       //console.log("res.data.info:\n");
      //       //console.log(res.data.info);
      //       store.setMessages(this.storeState.currSId, res.data.info);
      //     } else {
      //       // this.showAlert(res.data.info, "error");
      //       // console.log(res.data.info);
      //     }
      //   })
      //   .catch((err) => {
      //     this.showAlert("请求错误！", "error");
      //     //this.showAlert(err, "error");
      //     console.log(err);
      //   });
    },
    // 用于在刷新页面或者重新打开页面时更新用户的socket.id
    keepAlive() {
      let data = { socketId: this.$socket.id };
      axios
        .post("/api/user/keepAlive", data)
        .then((res) => {
          if (res.data.success) {
            store.setUsername(res.data.username);
          } else {
            console.log("转到login");
            this.$router.push({ name: "Login" }); // 进入主页
          }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          //this.showAlert(err, "error");
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("./assets/background1.jpg") no-repeat center center;
  background-size: cover;
  transform: scale(1);
  overflow: hidden;
}
</style>
