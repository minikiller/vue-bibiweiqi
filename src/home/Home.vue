<template>
  <div >
    <!-- <b-overlay v-if="getSpinner" rounded="sm"></b-overlay> -->
    <Card />
  </div>
</template>
<script>
import Card from "../component/Card.vue";
import { mapState, mapMutations, mapGetters } from "vuex";
import { EventBus } from "../index.js";
export default {
  name: "home",
  components: {
    Card
  },
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle", "setResult"]),
    hello() {
      this.$socket.emit("hello", { data: "1212" });
    }
  },
  data() {
    return {
      name: "我的对局室"
    };
  },
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    }),
    ...mapGetters("room", ["getSpinner"])
  },
  sockets: {
    //查看socket是否渲染成功
    connect() {
      console.log("链接成功");
    },
    disconnect() {
      console.log("断开链接");
    }, //检测socket断开链接
    reconnect() {
      console.log("重新链接");
    },
    // helloMsg(msg) {
    //   console.log(msg);
    // },
    resume(msg) {
      this.updateGame(msg.game);
      this.setResult(msg.result);
      this.$router.push({
        path: `/play`,
        query: { type: "resume", game_id: msg.gameId }
      });
    }
    // move() {
    //   this.updateGame(game);
    // }
  },
  mounted() {
    let that = this;
    this.updateNavTitle(this.name);
    this.$socket.emit("resume", {
      //检查是否有需要恢复的对局
      userId: this.account.user.name
    });
    // EventBus.$on("loading", value => {
    //   that.show = value;
    // });
    this.$nextTick(function() {
      // put code here
      // that.show = false;
    });
  }
};
</script>
