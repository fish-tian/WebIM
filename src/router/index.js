import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
//import Login from '../views/Login.vue'
// import Friend from '../components/TheFriendsBox'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login
  // },
  {
    path: '/',
    name: 'Home',
    components: {
      "default": Home,
      "friend": () => import(/* webpackChunkName: "friend" */ '../components/TheFriendsBox.vue'),
      //"request": () => import(/* webpackChunkName: "login" */ '../components/TheRequestBox.vue')
      // "friend": () => import(/* webpackChunkName: "friend" */ '../components/TheFriendsBox.vue'),
      // "request": () => import(/* webpackChunkName: "login" */ '../components/TheRequestBox.vue')
    }
  },
  {
    path: '/request',
    name: 'Request',
    components: {
      //"default": Home,
      "request": () => import(/* webpackChunkName: "login" */ '../components/TheRequestBox.vue')
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    component: () => import(/* webpackChunkName: "chat" */ '../components/TheChatBox.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../components/TheLoginBox.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
