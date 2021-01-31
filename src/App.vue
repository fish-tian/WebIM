<template>
  <div>
    <span class="bg"></span>
    <v-app>
      <v-main>
        <!-- <Home/> -->
        <!-- 在主页和login页面切换 -->
        <router-view :key="$route.path" />
      </v-main>
    </v-app>
  </div>
</template>

<script>
//import TheNavigation from '@/components/TheNavigation';
//import Home from './views/Home'
export default {
  name: "App",
  components: {
    //TheNavigation
    // Login
    //Home
  },

  data: () => ({
    //
  }),
};
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("./assets/background3.jpg")
      no-repeat center center;
  background-size: cover;
  transform: scale(1.1);
}
</style>