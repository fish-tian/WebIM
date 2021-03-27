// 使用 store 模式，暂不使用vuex
export default {
  state: {
    user: {
      username: ""
    },
    friends: [],
    friendsOrRequest: 0,
    messages: [],
    requests: [],
    socketId: "",
    currFriendId: undefined,
  },
  setUsername(username) {
    this.state.user.username = username;
  },
  setFriends(friends) {
    this.state.friends = friends;
  },
  setFriendsOrRequest(data) {
    this.state.friendsOrRequest = data;
  },
  setMessages(messages) {
    this.state.messages = messages;
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
