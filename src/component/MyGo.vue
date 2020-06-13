<template>
  <div>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>
    <audio id="luozi" src="/static/voice/mian1.mp3" preload="auto"></audio>
    <audio id="audioBegin" src="/static/voice/mian3.mp3" preload="auto"></audio>
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
    <div>
      <b-card-group deck>
        <b-card header-tag="header" footer-tag="footer">
          <b-card-text>
            <info
              :avatar="blackOne.avatar"
              :name="blackOne.name"
              :rank="blackOne.rank"
              :turn="b1_turn"
              :playtime="BL"
              :caps="b_caps"
              :imgSrc="b_img"
              :win="b_win"
            ></info>
          </b-card-text>
        </b-card>

        <b-card header-tag="header" footer-tag="footer">
          <b-card-text>
            <info
              :avatar="whiteOne.avatar"
              :name="whiteOne.name"
              :rank="whiteOne.rank"
              :turn="w1_turn"
              :playtime="WL"
              :caps="w_caps"
              :imgSrc="w_img"
              :win="w_win"
            ></info>
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <div class="mt-3">
      <b-card-group deck>
        <b-card header-tag="header" footer-tag="footer">
          <b-card-text>
            <info
              :avatar="blackTwo.avatar"
              :name="blackTwo.name"
              :rank="blackTwo.rank"
              :turn="b2_turn"
              :playtime="BL"
              :caps="b_caps"
              :imgSrc="b_img"
              :win="b_win"
            ></info>
          </b-card-text>
        </b-card>

        <b-card header-tag="header" footer-tag="footer">
          <b-card-text>
            <info
              :avatar="whiteTwo.avatar"
              :name="whiteTwo.name"
              :rank="whiteTwo.rank"
              :turn="w2_turn"
              :playtime="WL"
              :caps="w_caps"
              :imgSrc="w_img"
              :win="w_win"
            ></info>
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import {
  initGame,
  initResumeGame,
  initGameData,
  setConfirm
} from "../_helpers";
import { mapState, mapMutations } from "vuex";
import { vueBaberrage, MESSAGE_TYPE } from "vue-baberrage";
import { EventBus } from "../index.js";
import Info from "../component/Info";
export default {
  name: "mygo",
  components: {
    vueBaberrage,
    Info
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
      avatar: "http://sunlingfeng.0431zy.com/1.png",
      BL: "", //黑棋剩余时间
      WL: "", //白棋剩余时间
      b1_turn: false,
      w1_turn: false,
      b2_turn: false,
      w2_turn: false,
      w_caps: 0, //白棋提子数
      b_caps: 0, //黑棋提子数
      b_img: "/static/black_64.png",
      w_img: "/static/white_64.png",
      b_win: false,
      w_win: false
    };
  },
  /* watch: {
    BL: function(newValue, oldValue) {
      // console.log(newValue + " is new");
    },
    WL: function(newValue, oldValue) {}
  }, */
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"])
  },
  sockets: {
    get_message(data) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: data.avatar,
        msg: data.username + " => " + data.message,
        time: 10,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "normal"
      });
    },
    joinlobby(user) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: this.avatar,
        msg: "系统: " + user + "进入对局室",
        time: 10,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "red"
      });
    },
    leavelobby(data) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: this.avatar,
        msg: "系统: " + data + "离开对局室",
        time: 10,
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
    },
    prepare(msg) {
      document.getElementById("audioBegin").play();
    }
  },
  mounted() {
    let that = this;
    this.BL = this.total_time;
    this.WL = this.total_time;
    EventBus.$on("w_timeout", value => {
      that.WL = value;
    });
    EventBus.$on("b_timeout", value => {
      that.BL = value;
    });
    EventBus.$on("yourturn", () => {
      document.getElementById("luozi").play();
      setConfirm(false);
    });

    EventBus.$on("caps", value => {
      that.b_caps = value.black;
      that.w_caps = value.white;
    });
    EventBus.$on("gameove", msg => {
      if (msg.result.indexOf("白") > -1) {
        that.w_win = true;
      } else if (msg.result.indexOf("黑") > -1) {
        that.b_win = true;
      }
      that.b1_turn = false;
      that.b2_turn = false;
      that.w1_turn = false;
      that.w2_turn = false;
      console.log("go component game is over! result is " + msg);
    });

    EventBus.$on("myturn", value => {
      if (value == 0) {
        that.b1_turn = true;
        that.b2_turn = false;
        that.w1_turn = false;
        that.w2_turn = false;
      }
      if (value == 1) {
        that.b1_turn = false;
        that.b2_turn = false;
        that.w1_turn = true;
        that.w2_turn = false;
      }
      if (value == 2) {
        that.b1_turn = false;
        that.b2_turn = true;
        that.w1_turn = false;
        that.w2_turn = false;
      }
      if (value == 3) {
        that.b1_turn = false;
        that.b2_turn = false;
        that.w1_turn = false;
        that.w2_turn = true;
      }
    });
    // document.getElementById("wgo-control").style.display = "none";
    if (this.$route.query.type == "resume") {
      initGameData(this.account.user.name, this.games.game);
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
    } else if (this.gameStatus == "未开始") {
      initGame(this.$refs.player, {
        total_time: this.total_time,
        blackOne: this.blackOne.name,
        blackTwo: this.blackTwo.name,
        whiteOne: this.whiteOne.name,
        whiteTwo: this.whiteTwo.name
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
  z-index: 100;
  width: 100%;
  height: 100vh;
}
</style>
