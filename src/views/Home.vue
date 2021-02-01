<template>

<v-container>
  <!-- 导航栏 -->
      <TheNavigation />
  <v-row>
    <v-col>
      <TheFriendsBox />
      <!-- <router-view/> -->
      <!-- <router-view name="friend"/> -->
      <!-- <router-view name="request"/> -->
    </v-col>
    <v-col>
      <TheRequestBox />
      <!-- <router-view/> -->
      <!-- <router-view name="friend"/> -->
      <!-- <router-view name="request"/> -->
    </v-col>

    <v-spacer></v-spacer>
    <v-col>
      <!-- <TheChatBox /> -->
      <!-- <router-view :key="$route.path"/> -->
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import TheFriendsBox from "@/components/TheFriendsBox"
// import TheChatBox from "@/components/TheChatBox"
import TheNavigation from '@/components/TheNavigation'
import TheRequestBox from "@/components/TheRequestBox"

export default {
  name: "Home",
  components: {
    TheNavigation,
    // TheChatBox,
    TheFriendsBox,
    TheRequestBox
  },
};
</script>
