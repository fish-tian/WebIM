<template>
<v-container>
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

export default {
  name: "Home",
  components: {
    TheChatBox,
    TheFriendsBox,
  },
};
</script>
