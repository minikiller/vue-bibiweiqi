<template>
  <div>
    <div style="width: 100%; margin: 0" ref="player"></div>
  </div>
</template>

<script>
import { initGame, resumeGame, socket } from "../_helpers";
import { mapState, mapActions } from "vuex";
import { EventBus } from "../../src/index";

export default {
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  props: {
    total_time: String,
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    initGame(this.$refs.player, {
      total_time: this.total_time,
      blackOne: this.blackOne,
      blackTwo: this.blackTwo,
      whiteOne: this.whiteOne,
      whiteTwo: this.whiteTwo
    });
    //棋局恢复
    EventBus.$on("resumeGame", msg => {
      resumeGame(msg);
    });
    // socket.emit("login", account.user.name);
  }
};
</script>
<style scoped>
@import "/static/wgo.player.css";
</style>
