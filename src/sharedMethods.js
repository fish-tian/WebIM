import axios from "axios";

// 获取所有消息
async function getMessage(sid) {
  let data = {
    sid: sid,
  };
  return axios
    .post("/api/message/getAll", data);
    // .then((res) => {
    //   if (res.data.success) {
    //     //console.log("res.data.info:\n");
    //     //console.log(res.data.info);
    //     store.setMessages(this.storeState.currSId, res.data.info);
    //     this.scrollToDown();
    //     // console.log("当前会话为--------"+this.storeState.currSId);
    //     // this.updateRead(this.storeState.currSId);
    //   } else {
    //     // this.showAlert(res.data.info, "error");
    //   }
    // })
    // .catch((err) => {
    //   this.showAlert("请求错误！", "error");
    //   console.log(err);
    // });
}

//更新发送消息状态
async function updateRead(sid) {
  const data = {
    message: "",
    sid: sid,
  };

  this.message = "";
  return axios.post("/api/message/updateRead", data);
  // .then((res) => {
  //   if (res.data.success) {
  //     // setTimeout(() => {
  //     //   console.log("更新状态消息发送---");
  //     // }, 1000);
  //   }
  // });
}

//获取所有会话
async function getAllSessions() {
  // 如果 cookie 中有 session，就请求获取好友列表
  if (this.$cookies.get("koa.sess")) {
    return axios
      .get("/api/session/getAll");
      // .then((res) => {
      //   if (res.data.success) {
      //     store.setSessions(res.data.info);
      //     for (const session of res.data.info) {
      //       this.getAllMessages(session.sid);
      //     }

      //     //this.lists = res.data.lists;
      //   } else {
      //     store.setSessions(null);
      //   }
      // })
      // .catch((err) => {
      //   alert(err);
      // });
  } else {
    return Promise.reject();
  }
}

// 获取所有好友
async function getAllFriends() {
  // 如果 cookie 中有 session，就请求获取好友列表
  if (this.$cookies.get("koa.sess")) {
    return axios
      .get("/api/friend/getAll");
      // .then((res) => {
      //   if (res.data.success) {
      //     //console.log(res.data.info[0].message);
      //     store.setFriends(res.data.info);
      //     // store.setMessage(res.data.message);
      //     //this.friends = res.data.info;
      //     this.lists = res.data.lists;
      //     //console.log(this.friends);
      //     //console.log(this.lists);
      //   } else {
      //     store.setFriends(null);
      //   }
      // })
      // .catch((err) => {
      //   alert(err);
      // });
  }  else {
    return Promise.reject();
  }
}

// 获取所有请求
async function getAllRequests() {
  // 如果 cookie 中有 session，就请求获取所有好友请求
  if (this.$cookies.get("koa.sess")) {
    return axios
      .get("/api/friend/getAllRequests");
      // .then((res) => {
      //   if (res.data.success) {
      //     store.setRequests(res.data.info);
      //     //this.requests = res.data.info;
      //     //console.log("this.requests--------");
      //     //console.log(this.requests);
      //   } else {
      //     store.setRequests(null);
      //   }
      // })
      // .catch((err) => {
      //   alert(err);
      // });
  }  else {
    return Promise.reject();
  }
}

export default {
  updateRead,
  getMessage,
  getAllSessions,
  getAllFriends,
  getAllRequests,
}
