<template>

<v-container>
  <!-- 导航栏 -->
      <TheNavigation />
  <v-row>
    <v-col>
      <TheFriendsBox />
    </v-col>

    <v-spacer></v-spacer>
    <v-col>
      <TheChatBox />
      <router-view :key="$route.path"/>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import TheFriendsBox from "@/components/TheFriendsBox.vue"
import TheChatBox from "@/components/TheChatBox.vue"
import TheNavigation from '@/components/TheNavigation';
export default {
  name: "Home",
  components: {
    TheNavigation,
    TheChatBox,
    TheFriendsBox,
  },
};
</script>
