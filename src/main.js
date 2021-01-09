import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueCookie from 'vue-cookie';
Vue.config.productionTip = false;
Vue.use(VueCookie);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
