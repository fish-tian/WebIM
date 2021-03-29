// 使用 store 模式，暂不使用vuex
export default {
  state: {
    user: {
      username: "",
      message:"",
    },
    friends: [],
    friendsOrRequest: 0,
    messages: [],               // 存储和其他人的聊天消息 [{sid: xxx, messages:[] }, {sid: xxx, messages:[] }]
    unfinishedMessages: [],     // 存储和他人暂未发送成功的消息 [{sid: xxx, messages:[], mid }, {sid: xxx, messages:[], mid }] ，mid为自增唯一标识符
    lastMsg:"",
    requests: [],
    socketId: "",
    currFriendId: undefined,
    currSId: undefined,
    flag: undefined,
  },
  setUsername(username) {
    this.state.user.username = username;
  },
  setMessage(message) {
    this.state.user.message = message;
  },
  setFriends(friends) {
    console.log(friends);
    this.state.friends = friends;
  },
  setFriendsOrRequest(data) {
    this.state.friendsOrRequest = data;
  },
  setMessages(sid, messages) {
    console.log(messages);
    let index = this.state.messages.findIndex(item => {
      return sid === item.sid;
    });
    if(index === -1) {
      this.state.messages.push({sid: sid, messages: []});
      index = this.state.messages.length - 1;
    }
    this.state.messages[index].messages = messages;
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
    if(index === -1) {
      this.state.unfinishedMessages.push({sid: sid, messages: [], mid: 0});
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
