// 使用 store 模式，暂不使用vuex
export default {
  state: {
    user: {
      username: "",
      message:"",
    },
    friends: [],
    friendsOrRequest: 0,
    messages: [],
    lastMsg:"",
    requests: [],
    socketId: "",
    currFriendId: undefined,
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
  setMessages(messages) {
    this.state.messages = messages;
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
}
