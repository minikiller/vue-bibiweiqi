<template>
  <div>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>
    <div class="container">
      <vue-baberrage
        :isShow="barrageIsShow"
        :barrageList="barrageList"
        :maxWordCount="maxWordCount"
        :throttleGap="throttleGap"
        :loop="barrageLoop"
        :boxHeight="boxHeight"
        :messageHeight="messageHeight"
      ></vue-baberrage>
    </div>
    <div style="width: 100%; margin: 0" ref="player"></div>
  </div>
</template>

<script>
import { initGame, initResumeGame, initGameData } from "../_helpers";
import { mapState, mapMutations } from "vuex";
import { vueBaberrage, MESSAGE_TYPE } from "vue-baberrage";

export default {
  name: "mygo",
  components: {
    vueBaberrage
  },
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all,
      games: state => state.games
    })
  },
  props: {
    total_time: String,
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String,
    gameStatus: String
  },
  data() {
    return {
      barrageIsShow: true,
      messageHeight: 3,
      boxHeight: 150,
      barrageLoop: false,
      maxWordCount: 3,
      throttleGap: 2000,
      currentId: 0,
      barrageList: [],
      avatar: "http://sunlingfeng.0431zy.com/1.png"
    };
  },

  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"])
  },
  sockets: {
    get_message(data) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: data.avatar,
        msg: data.username + " => " + data.message,
        time: 5,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "normal"
      });
    },
    joinlobby(user) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: this.avatar,
        msg: "系统: " + user + "进入对局室",
        time: 5,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "red"
      });
    },
    leavelobby(data) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: this.avatar,
        msg: "系统: " + data + "离开对局室",
        time: 5,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "red"
      });
    },
    view(msg) {
      // this.success(msg);
      this.updateGame(msg.game);

      //观战
      initGameData(this.account.user.name, this.games.game);
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
      document.getElementById("wgo-control").style.display = "";
    }
  },
  mounted() {
    // document.getElementById("wgo-control").style.display = "none";
    if (this.$route.query.type == "resume") {
      initGameData(this.account.user.name, this.games.game);
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
    } else if (this.gameStatus == "未开始") {
      initGame(this.$refs.player, {
        total_time: this.total_time,
        blackOne: this.blackOne,
        blackTwo: this.blackTwo,
        whiteOne: this.whiteOne,
        whiteTwo: this.whiteTwo
      });
    }
  }
};
</script>
<style scoped>
@import "/static/wgo.player.css";
.container {
  display: inline-block;
  position: absolute;
  z-index: 500;
  width: 100%;
  height: 100vh;
}
</style>
