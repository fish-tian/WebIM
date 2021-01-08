// 使用 store 模式，暂不使用vuex
export default {
  user: {
    userId: 1,
    username: "伊丽莎白·小红",
    userAvatar: "avatar0.jpeg",
    token: "NTS13UEIS87V12S4"
  },
  // friends: [
  //   {
  //     userId: 2,
  //     username: "尼古拉斯·小磊",
  //     userAvatar: "avatar1.jpeg"
  //   },
  //   {
  //     userId: 3,
  //     username: "莱昂纳多·小虎",
  //     userAvatar: "avatar2.jpeg"
  //   },
  //   {
  //     userId: 4,
  //     username: "克里斯蒂安·小恒",
  //     userAvatar: "avatar3.jpeg"
  //   }
  // ],
  friend: null,
  messages: [
    {
      mId: 4,
      userId: 2,
      isSender: 0,
      content: "在么？",
      timestamp: "4"
    },
    {
      mId: 1,
      userId: 2,
      isSender: 0,
      content: "美女你好",
      timestamp: "1"
    },
    {
      mId: 2,
      userId: 3,
      isSender: 0,
      content: "Hello",
      timestamp: "3"
    },
    {
      mId: 3,
      userId: 4,
      isSender: 0,
      content: "很高兴认识你",
      timestamp: "5"
    },
    {
      mId: 5,
      userId: 2,
      isSender: 1,
      content: "你是谁？",
      timestamp: "8"
    },
    {
      mId: 6,
      userId: 2,
      isSender: 0,
      content: "我是尼古拉斯·小磊",
      timestamp: "11"
    },
    {
      mId: 8,
      userId: 3,
      isSender: 0,
      content: "我是莱昂纳多·小虎",
      timestamp: "20"
    },
    {
      mId: 9,
      userId: 3,
      isSender: 1,
      content: "我是伊丽莎白·小红",
      timestamp: "22"
    },
    {
      mId: 10,
      userId: 4,
      isSender: 1,
      content: "我也是",
      timestamp: "26"
    },
    {
      mId: 7,
      userId: 3,
      isSender: 1,
      content: "hi",
      timestamp: "12"
    }
  ]
}
