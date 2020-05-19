<template>
  <div>
    <div ref="videos-container"></div>
  </div>
</template>
<script>
import { connection } from "../_helpers";
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    gameId: String,
    gameInfo: null
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  data() {
    return {};
  },
  mounted() {
    connection.videosContainer =this.$refs.videos-container;

    connection.userid =this.account.user.name;
    connection.openOrJoin(gameId, (isRoomJoined, roomid, error) => {
      console.log(isRoomJoined, roomid, error);
    });
  }
};
</script>