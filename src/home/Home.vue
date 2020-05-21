<template>
  <div id="app">
    <Navbar />
    <Card />
  </div>
</template>
<script>
import Card from "../component/Card.vue";
import { mapState, mapMutations } from "vuex";
import Navbar from "../component/NavBar.vue";
import { socket } from "../_helpers";
import { EventBus } from "../index.js";

export default {
  name: "home",
  components: {
    Navbar,
    Card
  },
  methods: {
    ...mapMutations("games", ["updateGame"])
  },
  data() {
    return {
      _socket: null
    };
  },
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  mounted() {
    this._socket = socket;
    this._socket.emit("resume", {
      userId: this.account.user.name
    });
    EventBus.$on("resume", msg => {
      this.updateGame(msg.game);
      this.$router.push({
        path: `/play/${msg.gameId}`,
        query: { type: "resume" }
      });
    });
  }
};
</script>
