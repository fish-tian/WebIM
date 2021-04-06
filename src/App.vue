<template>
  <div style="width: 100%; height: 100%; overflow: hidden;">
    <span class="bg"></span>
    <v-app>
      <v-main>
        <!-- <Home/> -->
        <!-- 在主页和login页面切换 -->
        <router-view :key="$route.path" style="padding: 50px "/>
      </v-main>
    </v-app>
  </div>
</template>

<script>
//import TheNavigation from '@/components/TheNavigation';
//import Home from './views/Home'
import store from "@/store.js";
import axios from "axios";
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
    this.keepAlive();
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      console.log("socket id: " + this.$socket.id);
      store.setSocketId(this.$socket.id);
      this.keepAlive();
    },
    // 出现连接错误，重新连接
    connect_error() {
      this.connect();
    },
    disconnect() {
      alert("websocket连接出现错误，请刷新页面后重试");
    },
    newRequest(data) {
      console.log("-- newrequest: \n" + data);
      store.setRequests(data);
    },
    newFriend(data) {
      console.log("-- newfriend: \n" + data);
      store.setFriends(data);
    },
    newMessage(data) {
      //console.log("-- newmessage: \n" + data[data.length-1]["message"]);
      console.log("out+ck");
      //store.setLastMsg(data[data.length-1]["message"]);
      store.setMessages(data.sid, data.messages);
    },
    lastMsg(data) {
      console.log("-- LastMessage: \n" + data);
      store.setlastMsg(data);
    }
  },
  methods: {
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
          
          // if (res.data.success) {
          //   //this.showAlert("成功删除好友！", "success");
          //   //this.getAllFriends();
          // } else {
          //   //this.showAlert(res.data.info, "error");
          //   // console.log(res.data.info);
          // }
        })
        .catch((err) => {
          this.showAlert("请求错误！", "error");
          //this.showAlert(err, "error");
          console.log(err);
        });
    }
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