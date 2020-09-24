<template>
  <div>
    <audio id="dog" src="/static/dog.mp3" preload="auto"></audio>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>
    <audio id="audioPlay" src="/static/voice/turn.mp3" preload="auto"></audio>
    <audio id="audioBegin" src="/static/voice/start.mp3" preload="auto"></audio>
    <audio ref="audioMinute0" src="/static/voice/0.mp3" preload="auto"></audio>
    <audio ref="audioMinute1" src="/static/voice/1.mp3" preload="auto"></audio>
    <audio ref="audioMinute2" src="/static/voice/2.mp3" preload="auto"></audio>
    <audio ref="audioMinute3" src="/static/voice/3.mp3" preload="auto"></audio>
    <audio ref="audioMinute4" src="/static/voice/4.mp3" preload="auto"></audio>
    <audio ref="audioMinute5" src="/static/voice/5.mp3" preload="auto"></audio>
    <audio ref="audioMinute6" src="/static/voice/6.mp3" preload="auto"></audio>
    <audio ref="audioMinute7" src="/static/voice/7.mp3" preload="auto"></audio>
    <audio ref="audioMinute8" src="/static/voice/8.mp3" preload="auto"></audio>
    <audio ref="audioMinute9" src="/static/voice/9.mp3" preload="auto"></audio>
    <audio ref="audioMinute10" src="/static/voice/10.mp3" preload="auto"></audio>
    <audio ref="audioMinute20" src="/static/voice/20.mp3" preload="auto"></audio>
    <audio ref="audioMinuteBegin" src="/static/voice/begin.mp3" preload="auto"></audio>
    <audio ref="audioMinuteEnd1" src="/static/voice/end1.mp3" preload="auto"></audio>
    <audio ref="audioMinuteEnd2" src="/static/voice/end2.mp3" preload="auto"></audio>

    <b-row class="ml-2 mr-2">
      <b-col cols="12" sm="12" md="6" xg="8">
        <div style="margin: 0 -45px;">
          <div style="100%" ref="player"></div>
          <div align="center">
            <b-button-group v-if="isTurn" size="lg">
              <b-button variant="primary" @click="confirm">确认</b-button>
              <b-button variant="danger" @click="cancel">取消</b-button>
            </b-button-group>
          </div>
        </div>
      </b-col>
      <b-col cols="12" sm="12" md="6" xg="4">
        <div>
          <b-card-group deck>
            <b-card header-tag="header" footer-tag="footer">
              <b-card-text>
                <info
                  ref="black1_info"
                  :avatar="blackOne.avatar"
                  :name="blackOne.name"
                  :rank="blackOne.rank"
                  :turn="b1_turn"
                  :playtime="games.BL"
                  :caps="b_caps"
                  :imgSrc="b_img"
                  :win="b_win"
                  :offline="b1_offline"
                  :prepared="b1_prepared"
                  :numbers="games.B_number"
                ></info>
              </b-card-text>
            </b-card>

            <b-card header-tag="header" footer-tag="footer">
              <b-card-text>
                <info
                  ref="white1_info"
                  :avatar="whiteOne.avatar"
                  :name="whiteOne.name"
                  :rank="whiteOne.rank"
                  :turn="w1_turn"
                  :playtime="games.WL"
                  :caps="w_caps"
                  :imgSrc="w_img"
                  :win="w_win"
                  :offline="w1_offline"
                  :prepared="w1_prepared"
                  :numbers="games.W_number"
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
                  ref="black2_info"
                  :avatar="blackTwo.avatar"
                  :name="blackTwo.name"
                  :rank="blackTwo.rank"
                  :turn="b2_turn"
                  :playtime="games.BL"
                  :caps="b_caps"
                  :imgSrc="b_img"
                  :win="b_win"
                  :offline="b2_offline"
                  :prepared="b2_prepared"
                  :numbers="games.B_number"
                ></info>
              </b-card-text>
            </b-card>

            <b-card header-tag="header" footer-tag="footer">
              <b-card-text>
                <info
                  ref="white2_info"
                  :avatar="whiteTwo.avatar"
                  :name="whiteTwo.name"
                  :rank="whiteTwo.rank"
                  :turn="w2_turn"
                  :playtime="games.WL"
                  :caps="w_caps"
                  :imgSrc="w_img"
                  :win="w_win"
                  :offline="w2_offline"
                  :prepared="w2_prepared"
                  :numbers="games.W_number"
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
  setConfirm,
} from "../_helpers";
import { mapState, mapMutations } from "vuex";
import { EventBus } from "../index.js";
import Info from "../component/Info";
import { isPc, clear_all } from "../_helpers";
import config from "config";
import { gameService } from "../_services";

export default {
  name: "mygo",
  components: {
    Info,
  },
  computed: {
    ...mapState({
      account: (state) => state.account,
      users: (state) => state.users.all,
      games: (state) => state.games,
    }),
  },
  props: {
    total_time: String,
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String,
    gameStatus: String,
    isOpponent: Boolean, //是否为对局者
    isTurn: Boolean, //是否为对局者
  },
  data() {
    return {
      barrageIsShow: true,
      messageHeight: 3,
      boxHeight: 150,
      barrageLoop: false,
      maxWordCount: 3,
      throttleGap: 2000,
      BL: "", //黑棋剩余时间
      WL: "", //白棋剩余时间
      b1_turn: false,
      w1_turn: false,
      b2_turn: false,
      w2_turn: false,
      b1_offline: true,
      b2_offline: true,
      w1_offline: true,
      w2_offline: true,
      b1_prepared: false,
      b2_prepared: false,
      w1_prepared: false,
      w2_prepared: false,
      w_caps: 0, //白棋提子数
      b_caps: 0, //黑棋提子数
      b_img: "/static/black_64.png",
      w_img: "/static/white_64.png",
      b_win: false,
      w_win: false,
      // b_number: 3, //默认黑的读秒次数
      // w_number: 3, //默认白的读秒次数
      move_url: null,
      b_yourturn: false, //用于恢复对局时候，如果落子为真，则播放语音
      time_count: 30,
    };
  },
  /* watch: {
    BL: function(newValue, oldValue) {
      // console.log(newValue + " is new");
    },
    WL: function(newValue, oldValue) {}
  }, */
  methods: {
    ...mapMutations("games", [
      "updateGame",
      "updateNavTitle",
      "setResult",
      "setBL",
      "setWL",
      "setB_number",
      "setW_number",
    ]),
    ...mapMutations("alert", ["success", "error", "clear"]),
    confirm() {
      setConfirm(true);
    },
    cancel() {
      setConfirm(false);
      // alert(this.isTurn);
      // this.isTurn = false;
      EventBus.$emit("confirmTurn", false);
    },
    initVoice() {
      //调用语音服务
      gameService.moveVoice().then((data) => {
        let url = `${config.apiUrl}` + "/" + data.url;
        console.log(url);
        this.move_url = url;
        let audio = document.getElementById("audioPlay");
        audio.src = url;
        // .setSrc(url);
        audio.load();
        let that = this;
        audio.onloadeddata = function () {
          if (that.b_yourturn == true) audio.play();
          // alert("Browser has loaded the current frame");
        };
      });
    },
    //处理读秒的函数
    getCode(value) {
      var that = this;
      if (value == "black") {
        if (that.games.B_number == 1 && that.games.BL == 30) {
          //最后一次读秒
          that.$refs.audioMinuteEnd1.play();
        } else if (that.games.B_number == 2 && that.games.BL == 30) {
          // that.$refs.audioMinuteBegin.play();
        } else if (that.games.B_number == 3 && that.games.BL == 30) {
          that.$refs.audioMinuteBegin.play();
        }
        // console.log("this is my read minuter time");
        if (that.games.BL > 0 && that.games.BL <= that.time_count) {
          // this.count--;
          // console.log("this is my read minuter time inside game");
          that.setBL(that.games.BL - 1);
          if (that.games.BL == 20) that.$refs.audioMinute20.play();
          else if (that.games.BL == 10) that.$refs.audioMinute10.play();
          else if (that.games.BL >= 0 && that.games.BL < 10) {
            that.$refs["audioMinute" + that.games.BL].play();
          }
          if (that.games.BL == 0 && that.games.B_number == 3) {
            that.setB_number(that.games.B_number - 1);
            // set_b_number(that.games.B_number - 1);
            that.setBL(that.time_count);
            // setTimeout(that.$refs.audioMinuteEnd2.play(), 1000);
            that.$refs.audioMinuteEnd2.play();
          } else if (that.games.BL == 0 && that.games.B_number == 2) {
            that.setB_number(that.games.B_number - 1);
            // set_b_number(that.games.B_number - 1);
            // this.count = this.time_count;
            that.setBL(that.time_count);
            // setTimeout(that.$refs.audioMinuteEnd1.play(), 1000);
            that.$refs.audioMinuteEnd1.play();
          } else if (that.games.BL == 0 && that.games.B_number == 1) {
            // this.show = true;
            that.setB_number(that.games.B_number - 1);
            // set_b_number(that.games.B_number - 1);
            clear_all();
            // alert("you failed");
            EventBus.$emit("timeout", "白超时胜");
          }
        }
      } else {
        if (that.games.W_number == 1 && that.games.WL == 30) {
          //最后一次读秒
          that.$refs.audioMinuteEnd1.play();
        } else if (that.games.W_number == 2 && that.games.WL == 30) {
          // that.$refs.audioMinuteBegin.play();
        } else if (that.games.W_number == 3 && that.games.WL == 30) {
          that.$refs.audioMinuteBegin.play();
        }
        // console.log("this is my read minuter time");
        if (that.games.WL > 0 && that.games.WL <= that.time_count) {
          // this.count--;
          // console.log("this is my read minuter time");
          that.setWL(that.games.WL - 1);
          if (that.games.WL == 20) that.$refs.audioMinute20.play();
          else if (that.games.WL == 10) that.$refs.audioMinute10.play();
          else if (that.games.WL >= 0 && that.games.WL < 10) {
            that.$refs["audioMinute" + that.games.WL].play();
          }
          if (that.games.WL == 0 && that.games.W_number == 3) {
            that.setW_number(that.games.W_number - 1);
            // set_w_number(that.games.W_number - 1);
            that.setWL(that.time_count);
            // setTimeout(that.$refs.audioMinuteEnd2.play(), 1000);
            that.$refs.audioMinuteEnd2.play();
          } else if (that.games.WL == 0 && that.games.W_number == 2) {
            that.setW_number(that.games.W_number - 1);
            // set_w_number(that.games.W_number - 1);

            // this.count = this.time_count;
            that.setWL(that.time_count);
            // setTimeout(that.$refs.audioMinuteEnd1.play(), 1000);
            that.$refs.audioMinuteEnd1.play();
          } else if (that.games.WL == 0 && that.games.W_number == 1) {
            // this.show = true;
            that.setW_number(that.games.W_number - 1);
            // set_w_number(that.games.W_number - 1);

            clear_all();
            // that.timer = null;
            // alert("you failed");
            EventBus.$emit("timeout", "黑超时胜");
          }
        }
      }
    },
  },
  sockets: {
    play_dog(data) {
      document.getElementById("dog").play();
    },
    initGameUser(userlist) {
      this.b1_offline =
        userlist.indexOf(this.blackOne.name) > -1 ? false : true;
      this.b2_offline =
        userlist.indexOf(this.blackTwo.name) > -1 ? false : true;
      this.w1_offline =
        userlist.indexOf(this.whiteOne.name) > -1 ? false : true;
      this.w2_offline =
        userlist.indexOf(this.whiteTwo.name) > -1 ? false : true;
    },

    joinlobby(user) {
      /* this.barrageList.push({
        id: ++this.currentId,
        avatar: this.avatar,
        msg: "系统: " + user + "进入对局室",
        time: 10,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "red"
      }); */
      this.b1_offline = user == this.blackOne.name ? false : this.b1_offline;
      this.b2_offline = user == this.blackTwo.name ? false : this.b2_offline;
      this.w1_offline = user == this.whiteOne.name ? false : this.w1_offline;
      this.w2_offline = user == this.whiteTwo.name ? false : this.w2_offline;
    },
    leavelobby(user) {
      /* // this.barrageList.push({
      //   id: ++this.currentId,
      //   avatar: this.avatar,
      //   msg: "系统: " + user + "离开对局室",
      //   time: 10,
      //   type: MESSAGE_TYPE.NORMAL,
      //   barrageStyle: "red"
      // }); */
      this.b1_offline = user == this.blackOne.name ? true : this.b1_offline;
      this.b2_offline = user == this.blackTwo.name ? true : this.b2_offline;
      this.w1_offline = user == this.whiteOne.name ? true : this.w1_offline;
      this.w2_offline = user == this.whiteTwo.name ? true : this.w2_offline;
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
      this.setResult(msg.result);
      initGameData(this.account.user.name, this.games.game);
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
      if (!this.isOpponent)
        document.getElementById("wgo-control").style.display = "";
    },
    //设置对局准备状态
    prepare(msg) {
      this.b1_prepared = msg[this.blackOne.name];
      this.b2_prepared = msg[this.blackTwo.name];
      this.w1_prepared = msg[this.whiteOne.name];
      this.w2_prepared = msg[this.whiteTwo.name];
    },
    //对局开始
    beginGame(msg) {
      document.getElementById("audioBegin").play();
    },
  },
  mounted() {
    let that = this;
    // this.BL = this.total_time;
    // this.WL = this.total_time;
    this.setBL(this.total_time);
    this.setWL(this.total_time);

    /* if (this.isOpponent) {
      this.initVoice();
    } */

    EventBus.$on("w_timeout", (value) => {
      if (value == 0) that.setWL(this.time_count);
      else {
        that.setWL(value);
      }
      // that.WL = value;
    });
    EventBus.$on("b_timeout", (value) => {
      if (value == 0) that.setBL(this.time_count);
      else {
        that.setBL(value);
      }
      // that.BL = value;
    });
    EventBus.$on("b_number", (value) => {
      console.log("set black number" + value);
      that.setB_number(value);
      // set_b_number(value);
      // that.BL = value;
    });
    EventBus.$on("w_number", (value) => {
      console.log("set white number" + value);
      that.setW_number(value);
      // set_w_number(value);
      // that.BL = value;
    });
    EventBus.$on("b_readTime", (value) => {
      this.getCode("black");
      // that.$refs.black1_info.beginTimer("black");
      // that.b_number = 3; //默认黑的读秒次数
      // clear_time();
    });
    EventBus.$on("w_readTime", (value) => {
      this.getCode("white");
      // that.$refs.white1_info.beginTimer("white");
      // that.b_number = 3; //默认白的读秒次数
      // clear_time();
    });

    EventBus.$on("clear_readTime", (value) => {
      // set_b_number(this.games.B_number);
      // set_w_number(this.games.W_number);

      if (value.black_time == 0) {
        //黑棋进入读秒
        this.setBL(30); //重新初始化黑棋的读秒时间
      }
      if (value.white_time == 0) {
        //白棋进入读秒,重新初始化读秒时间
        this.setWL(30);
      }
    });

    EventBus.$on("yourturn", () => {
      this.success("轮到你落子了！");
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
      // console.log("轮到你骡子了！");
    });

    EventBus.$on("caps", (value) => {
      that.b_caps = value.black;
      that.w_caps = value.white;
    });
    EventBus.$on("gameove", (msg) => {
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
    //控制按钮的显示
    EventBus.$on("myturn", (value) => {
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
      // if (this.games.game.BL == 0) {
      //   this.setBL(30);
      // }
      // if (this.games.game.WL == 0) {
      //   this.setWL(30);
      // }
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
    } else if (this.gameStatus == "未开始") {
      initGame(this.$refs.player, {
        total_time: this.total_time,
        number: 3, //读秒时间，默认为3次
        blackOne: this.blackOne.name,
        blackTwo: this.blackTwo.name,
        whiteOne: this.whiteOne.name,
        whiteTwo: this.whiteTwo.name,
      });
    }
  },
};
</script>
<style scoped>
@import "/static/wgo.player.css";
</style>
