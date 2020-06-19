<template>
  <div>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>
    <audio id="audioPlay"></audio>
    <audio id="audioBegin"></audio>
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
    <b-row class="ml-2 mr-2">
      <b-col cols="12" sm="12" md="8" xg="8">
        <div style="width: 100%; margin: 0" ref="player"></div>
      </b-col>
      <b-col cols="12" sm="12" md="4" xg="4">
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
      </b-col>
    </b-row>
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
import config from "config";
import { gameService } from "../_services";

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
    gameStatus: String,
    isOpponent: Boolean //是否为对局者
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
      w_win: false,
      move_url: null,
      b_yourturn: false //用于恢复对局时候，如果落子为真，则播放语音
    };
  },
  /* watch: {
    BL: function(newValue, oldValue) {
      // console.log(newValue + " is new");
    },
    WL: function(newValue, oldValue) {}
  }, */
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"]),
    ...mapMutations("alert", ["success", "error", "clear"])
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
    //用户掉线后重连
    updateRoomGame(msg) {
      this.updateGame(msg.game);
      initGameData(this.account.user.name, this.games.game);
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
    },

    prepare(msg) {
      document.getElementById("audioBegin").play();
    }
  },
  mounted() {
    let that = this;
    this.BL = this.total_time;
    this.WL = this.total_time;

    if (this.isOpponent) {
      gameService.moveVoice().then(data => {
        let url = `${config.apiUrl}` + "/" + data.url;
        console.log(url);
        this.move_url = url;
        let audio = document.getElementById("audioPlay");
        audio.src = url;
        // .setSrc(url);
        audio.load();
        let that=this;
        audio.onloadeddata = function() {
          if (that.b_yourturn == true) audio.play();
          // alert("Browser has loaded the current frame");
        };
      });
    }

    EventBus.$on("w_timeout", value => {
      that.WL = value;
    });
    EventBus.$on("b_timeout", value => {
      that.BL = value;
    });
    EventBus.$on("yourturn", () => {
      this.success("轮到你骡子了！");
      this.b_yourturn = true;
      var audio = document.getElementById("audioPlay");
      if (audio != null) audio.play();
      // var canPlay = true;
      /* while (canPlay) {
        if (audio.src != "") {
         
          canPlay = false;
        }
      } */
      setConfirm(false);
      console.log("轮到你骡子了！");
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
