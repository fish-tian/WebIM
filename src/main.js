import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false;
Vue.use(VueCookies);

const options = { withCredentials: true }; //Options object to pass into SocketIO
Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3001', options), //options object is Optional
  })
);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
