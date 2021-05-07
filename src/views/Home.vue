<template>

<v-container fluid > 
  <!-- 导航栏 -->

  <v-row>
    <v-spacer></v-spacer>
    <v-col class="d-flex">
      <TheNavigation />
      <TheSessionBox />
      <TheFriendsBox />
      <TheRequestBox />
      <TheGroupBox />
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
import TheGroupBox from "@/components/TheGroupBox"
import TheSessionBox from "@/components/TheSessionBox"

export default {
  name: "Home",
  components: {
    TheNavigation,
    TheChatBox,
    TheFriendsBox,
    TheRequestBox,
    TheGroupBox,
    TheSessionBox
  },
};
</script>
