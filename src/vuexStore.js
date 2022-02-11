import Vue from "vue";
// import Vuex from 'vuex';

// 使用 store 模式，暂不使用vuex
export const storeConfig =
{
  state() {
    return {
      user: {
        username: "",
        message: "",
      },
      sessions: [],
      friends: [],
      show: [true, false, false, false],
      messages: [],               // 存储和其他人的聊天消息 [{sid: xxx, messages:[] }, {sid: xxx, messages:[] }]
      unfinishedMessages: [],     // 存储和他人暂未发送成功的消息 [{sid: xxx, messages:[], mid }, {sid: xxx, messages:[], mid }] ，mid为自增唯一标识符
      members: [],
      requests: [],
      socketId: "",
      //currFriendId: undefined,
      currSId: undefined,
      flag: undefined,
      msgStart: undefined,//每个会话的消息数量是不一样的
      k: undefined
    }
  },
  mutations: {
    setSessions(state, data) {
      //console.log(state, state, data);
      state.sessions = data;
    },
    addSession(state, data) {
      state.sessions.push(data);
    },
    setMsgNums(state, nums) {
      state.msgNums = nums;
    },
    setUsername(state, username) {
      state.user.username = username;
    },
    setMessage(state, message) {
      state.user.message = message;
    },
    setMsgStart(state, num) {
      state.msgStart = num;
    },
    setK(state, num) {//调用方法的次数
      state.k = num;
    },
    setFriends(state, friends) {
      //console.log(friends);
      state.friends = friends;
    },
    setShow(state, data) {

      let temp = [];
      temp.push(...state.show);

      for (let i = 0; i < temp.length; i++) {
        temp[i] = false;
      }
      temp[data] = true;
      state.show = temp;   // 修改数组中元素的值，vue没法动态绑定，只能这样
    },
    setMembers(state, { sid, members }) {
      let index = state.members.findIndex(item => {
        return sid === item.sid;
      });
      if (index === -1) {
        state.members.push({ sid: sid, members: [] });
        index = state.members.length - 1;
      }

      state.members[index].members = members;
      // console.log("store.js --------------");
      // console.log(members);
    },
    setMessages(state, { sid, messages }) {
      //console.log(messages);
      //console.log("-----"+sid+"---"+messages.length);
      let index = state.messages.findIndex(item => {
        return sid === item.sid;
      });
      if (index === -1) {
        state.messages.push({ sid: sid, messages: [], start: 0 });
        index = state.messages.length - 1;
      }
      let nums = 0;
      if (messages.length < 10) {
        nums = 0;
      } else {
        nums = messages.length - 10;
      }
      state.messages[index].messages = messages;
      state.messages[index].start = nums;

      // 给每一个 session 设置最近发送的 lastdate
      let sidIndex = state.sessions.findIndex((item) => {
        return item.sid === sid;
      });
      let len = state.messages[index].messages.length;
      Vue.set(state.sessions[sidIndex],
        "lastdate", len === 0 ? 0 : Date.parse(state.messages[index].messages[len - 1].date));
    },
    addMessage(state, { sid, message }) {
      let index = state.messages.findIndex(item => {
        return sid === item.sid;
      });
      if (index === -1) {
        state.messages.push({ sid: sid, messages: [], start: 0 });
        index = state.messages.length - 1;
      }

      state.messages[index].messages.push(message);

      // 给每一个 session 设置最近发送的 lastdate
      let sidIndex = state.sessions.findIndex((item) => {
        return item.sid === sid;
      });
      let len = state.messages[index].messages.length;

      Vue.set(state.sessions[sidIndex],
        "lastdate", len === 0 ? 0 : Date.parse(state.messages[index].messages[len - 1].date));
    },
    updateMsg(state, sid) {
      let index = state.messages.findIndex(item => {
        return sid === item.sid;
      });
      if (state.messages[index].start >= 10) {
        state.messages[index].start -= 10;
      } else {
        state.messages[index].start = 0;
      }
    },
    setLastMsg(state, lastMsg) {
      state.lastMsg = lastMsg;
      //console.log("in+cangk"+state.lastMsg);
    },
    setRequests(state, requests) {
      state.requests = requests;
    },
    setSocketId(state, socketId) {
      state.socketId = socketId;
    },
    setCurrFriendId(state, id) {
      state.currFriendId = id;
    },
    setCurrSId(state, id) {
      state.currSId = id;
    },
    setFlag(state, id) {
      state.flag = id;
    },
    addUnfinishedMessage(state, { sid, message }) {
      let index = state.unfinishedMessages.findIndex(item => {
        return sid === item.sid;
      });
      if (index === -1) {
        state.unfinishedMessages.push({ sid: sid, messages: [], mid: 0 });
        index = state.unfinishedMessages.length - 1;
      }
      const theMessage = {
        mid: ++state.unfinishedMessages[index].mid,
        message: message,
        fail: 0    // 0，发送中； 1，发送失败
      };
      state.unfinishedMessages[index].messages.push(theMessage);
      // return theMessage;
    },
    clearUnfinishedMessage(state, { sid, mid }) {
      let index = state.unfinishedMessages.findIndex(item => {
        return sid === item.sid;
      });
      let index2 = state.unfinishedMessages[index].messages.findIndex(item => {
        return mid === item.mid;
      });
      state.unfinishedMessages[index].messages.splice(index2, 1);
    },
    resetUnfinishedMessage(state, { sid, mid }) {
      let index = state.unfinishedMessages.findIndex(item => {
        return sid === item.sid;
      });
      let index2 = state.unfinishedMessages[index].messages.findIndex(item => {
        return mid === item.mid;
      });
      state.unfinishedMessages[index].messages[index2].fail = !state.unfinishedMessages[index].messages[index2].fail;
    }
  }
}
  ;
