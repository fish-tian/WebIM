<template>
  <div>
    <span class="bg"></span>
    <v-app>
      <!-- 导航栏 -->
      <TheNavigation />

      <v-main>
        <v-container>
          <v-row>
            <v-col>
              <TheFriendsBox />
            </v-col>

            <v-spacer></v-spacer>
            <!-- <v-col>
              <TheLoginBox />
            </v-col> -->
            <v-col>
              <TheChatBox />
              <router-view :key="$route.path" />
            </v-col>
          </v-row>
          <!-- <Login /> -->
          <!-- <router-view :key="$route.path"/> -->
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
//import store from "@/store.js";
import TheNavigation from "@/components/TheNavigation.vue";
// import Login from "@/views/Login.vue";
import TheFriendsBox from "@/components/TheFriendsBox.vue";
import TheChatBox from "@/components/TheChatBox.vue";

export default {
  name: "App",
  components: {
    TheNavigation,
    TheChatBox,
    TheFriendsBox,
    // Login
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
    url("https://www.gstatic.com/chat/hangouts/bg/e4c50a95c0148bb14931a73c2ae80d35-AnushElangovan-01.jpg")
      no-repeat center center;
  /* https://www.bing.com/th?id=OHR.PLNP_ZH-CN8120863549_1920x1080.jpg */
  /* https://www.gstatic.com/chat/hangouts/bg/e4c50a95c0148bb14931a73c2ae80d35-AnushElangovan-01.jpg */
  /* http://h2.ioliu.cn/bing/PorcupineBay_ZH-CN2252758146_1920x1080.jpg */
  /* http://h2.ioliu.cn/bing/EDCScotland_ZH-CN2038527689_1920x1080.jpg */
  /* http://h2.ioliu.cn/bing/ChipmunkJP_ZH-CN1697070440_1920x1080.jpg */
  /* http://h2.ioliu.cn/bing/NaturesWindowLookout_ZH-CN1799883608_1920x1080.jpg */
  /* http://h2.ioliu.cn/bing/InukshukLights_ZH-CN0756858983_1920x1080.jpg */
  background-size: cover;
  transform: scale(1.1);
}
</style>