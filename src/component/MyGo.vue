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
import { EventBus } from "../../src/index";
export default {
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  props: {
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String
  },
  data() {
    return {};
  },
  methods: {
    begin() {
      beginGame();
    },
    login() {
      console.log(`${this.account.user.name} is me`);
      socket.emit("login", this.account.user.name);
    }
  },
  mounted() {
    initGame(this.$refs.player, {
      total_time: 1000,
      blackOne: this.blackOne,
      blackTwo: this.blackTwo,
      whiteOne: this.whiteOne,
      whiteTwo: this.whiteTwo
    });

    EventBus.$on("fetchdata", group => {
      console.log("i get it ");
    });
    

    // socket.emit("login", account.user.name);
  }
};
</script>
