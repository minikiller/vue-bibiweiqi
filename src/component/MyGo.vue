<template>
  <div>
    <div class="form-group">
      <button class="btn btn-primary" @click="begin">Play</button>
      <button class="btn btn-primary" @click="login">login</button>
      <button class="btn btn-primary" @click="begin">Play</button>
      <div style="width: 100%; margin: 0" ref="player"></div>
    </div>
  </div>
</template>

<script>
import { initGame, beginGame, socket, socketServer } from "../_helpers";
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      account: (state) => state.account,
      users: (state) => state.users.all,
    }),
  },
  props: {
    total_time: String,
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String,
  },
  data() {
    return {};
  },
  methods: {
    begin() {
      beginGame();
    },
    login() {
      socket.emit("login", this.account.user.name);
    },
  },
  mounted() {
    initGame(this.$refs.player, {
      total_time: this.total_time,
      blackOne: this.blackOne,
      blackTwo: this.blackTwo,
      whiteOne: this.whiteOne,
      whiteOne: this.whiteOne,
    });
    // socket.emit("login", account.user.name);
  },
};
</script>
