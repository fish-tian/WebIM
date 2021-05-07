import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
// import VueSocketIO from 'vue-socket.io';
// import SocketIO from 'socket.io-client'

Vue.config.productionTip = false;
Vue.use(VueCookies);

// const options = { withCredentials: true }; //Options object to pass into SocketIO
// Vue.use(new VueSocketIO({
//     debug: true,
//     connection: SocketIO('http://localhost:3001', options),  // 如果需要局域网聊天，需要设置为局域网地址
//   })
// );

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
