<template>

<v-container fluid > 
  <!-- 导航栏 -->

  <v-row>
    <v-spacer></v-spacer>
    <v-col class="d-flex">
      <TheNavigation />
      <TheFriendsBox />
      <TheRequestBox />
      <TheChatBox />
      <!-- <router-view/> -->
      <!-- <router-view name="friend"/> -->
      <!-- <router-view name="request"/> -->
    </v-col>
    <!-- <v-col> -->
      <v-col></v-col>
      <!-- <router-view/> -->
      <!-- <router-view name="friend"/> -->
      <!-- <router-view name="request"/> -->
    <!-- </v-col> -->
  </v-row>

</v-container>
</template>

<script>
import TheFriendsBox from "@/components/TheFriendsBox"
import TheChatBox from "@/components/TheChatBox"
import TheNavigation from '@/components/TheNavigation'
import TheRequestBox from "@/components/TheRequestBox"

export default {
  name: "Home",
  components: {
    TheNavigation,
    TheChatBox,
    TheFriendsBox,
    TheRequestBox
  },
};
</script>
