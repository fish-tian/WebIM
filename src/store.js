import Vue from "vue";

// 使用 store 模式，暂不使用vuex
export default {
  state: {
    user: {
      username: "",
      message: "",
    },
    sessions: [],
    friends: [],
    show: [true, false, false, false],
    messages: [],               // 存储和其他人的聊天消息 [{sid: xxx, messages:[] }, {sid: xxx, messages:[] }]
    unfinishedMessages: [],     // 存储和他人暂未发送成功的消息 [{sid: xxx, messages:[], mid }, {sid: xxx, messages:[], mid }] ，mid为自增唯一标识符

    requests: [],
    socketId: "",
    //currFriendId: undefined,
    currSId: undefined,
    flag: undefined,
    msgStart: undefined,//每个会话的消息数量是不一样的
    k: undefined


  },
  setSessions(data) {
    //console.log(data);
    this.state.sessions = data;
  },
  addSession(data) {
    
  },
  setMsgNums(nums) {
    this.state.msgNums = nums;
  },
  setUsername(username) {
    this.state.user.username = username;
  },
  setMessage(message) {
    this.state.user.message = message;
  },
  setMsgStart(num) {
    this.state.msgStart = num;
  },
  setK(num) {//调用方法的次数
    this.state.k = num;
  },
  setFriends(friends) {
    //console.log(friends);
    this.state.friends = friends;
  },
  setShow(data) {

    let temp = [];
    temp.push(...this.state.show);

    for (let i = 0; i < temp.length; i++) {
      temp[i] = false;
    }
    temp[data] = true;
    this.state.show = temp;   // 修改数组中元素的值，vue没法动态绑定，只能这样
  },
  setMessages(sid, messages) {
    //console.log("-----"+sid+"---"+messages.length);
    let index = this.state.messages.findIndex(item => {
      return sid === item.sid;
    });
    if (index === -1) {
      this.state.messages.push({ sid: sid, messages: [], start: 0 });
      index = this.state.messages.length - 1;
    }
    let nums = 0;
    if (messages.length < 10) {
      nums = 0;
    } else {
      nums = messages.length - 10;
    }
    this.state.messages[index].messages = messages;
    this.state.messages[index].start = nums;

    // 给每一个 session 设置最近发送的 lastdate
    let sidIndex = this.state.sessions.findIndex((item)=>{
      return item.sid === sid;
    });
    let len = this.state.messages[index].messages.length;
    Vue.set(this.state.sessions[sidIndex], "lastdate", len === 0 ? 0 : Date.parse(this.state.messages[index].messages[len - 1].date));
  },
  updateMsg(sid) {
    let index = this.state.messages.findIndex(item => {
      return sid === item.sid;
    });
    if (this.state.messages[index].start >= 10) {
      this.state.messages[index].start -= 10;
    } else {
      this.state.messages[index].start = 0;
    }



  },
  setLastMsg(lastMsg) {
    this.state.lastMsg = lastMsg;
    //console.log("in+cangk"+this.state.lastMsg);
  },
  setRequests(requests) {
    this.state.requests = requests;
  },
  setSocketId(socketId) {
    this.state.socketId = socketId;
  },
  setCurrFriendId(id) {
    this.state.currFriendId = id;
  },
  setCurrSId(id) {
    this.state.currSId = id;
  },
  setFlag(id) {
    this.state.flag = id;
  },
  addUnfinishedMessage(sid, message) {
    let index = this.state.unfinishedMessages.findIndex(item => {
      return sid === item.sid;
    });
    if (index === -1) {
      this.state.unfinishedMessages.push({ sid: sid, messages: [], mid: 0 });
      index = this.state.unfinishedMessages.length - 1;
    }
    let theMessage = {
      mid: ++this.state.unfinishedMessages[index].mid,
      message: message,
      fail: 0    // 0，发送中； 1，发送失败
    };
    this.state.unfinishedMessages[index].messages.push(theMessage);
    return theMessage;
  },
  clearUnfinishedMessage(sid, mid) {
    let index = this.state.unfinishedMessages.findIndex(item => {
      return sid === item.sid;
    });
    let index2 = this.state.unfinishedMessages[index].messages.findIndex(item => {
      return mid === item.mid;
    });
    this.state.unfinishedMessages[index].messages.splice(index2, 1);
  },
  resetUnfinishedMessage(sid, mid) {
    let index = this.state.unfinishedMessages.findIndex(item => {
      return sid === item.sid;
    });
    let index2 = this.state.unfinishedMessages[index].messages.findIndex(item => {
      return mid === item.mid;
    });
    this.state.unfinishedMessages[index].messages[index2].fail = !this.state.unfinishedMessages[index].messages[index2].fail;
  }
}
