<template src="./PlayPage.html"></template>
<script>
import MyGo from "../component/MyGo";
import Chat from "../component/Chat";
import WebRTC from "../component/webrtc";
import { gameService } from "../_services";
import { mapState, mapMutations } from "vuex";
import { EventBus } from "../index.js";
import {
  enable_board,
  initGameData,
  showScore,
  setPassedStatus,
  readyMove,
  gameResign,
  toggleCoordinates,
  showMarker,
  regretCurrentGame,
  getGameTurn,
  getKifu,
  setConfirm,
  getWhichTurn
} from "../_helpers";

// import { WebRTC } from "plugin";
import { find, head } from "lodash/core";
import Vue from "vue";
var timeoutCallback = require("timeout-callback");
Vue.component(WebRTC.name, WebRTC);

export default {
  name: "playPage",
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  watch: {
    //监听websocket的连接和断开事件，并在连接后进行重连
    "$store.state.games.connected"(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // Do whatever makes sense now
      if (newValue === true) {
        this.$store.commit("alert/success", "连接服务器成功！");
        this.refresh();
        // this.$socket.emit("registerToRoom", this.$route.query.game_id);
      } else {
        this.$store.commit("alert/error", "连接服务器失败，重新登陆中...");
      }
    }
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
    ...mapMutations("games", [
      "updateGame",
      "updateNavTitle",
      "setResult",
      "setTurn"
    ]),
    //设置按钮的状态
    setButtonStatus() {
      this.btnText = "认输";
      this.canBegin = true;
      if (
        this.account.user.name == this.game.blackone_id.name ||
        this.account.user.name == this.game.whiteone_id.name
      ) {
        this.btnBeginDisable = false;
      } else {
        this.btnBeginDisable = true;
      }
      this.btnQuitDisable = true;
    },
    // 显示分数
    getScore() {
      if (this.endText == "开始数目") {
        this.endText = "结束数目";
        showScore();
      } else if (this.endText == "结束数目") {
        let _result = this.matchResult(this.games.result);
        // let _result="balck";
        this.$bvModal
          .msgBoxConfirm(_result, {
            title: "请确认",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "确定",
            cancelTitle: "取消",
            hideHeaderClose: false,
            centered: true
          })
          .then(value => {
            if (value) {
              //this.setResult(result);
              showScore();
              this.endText = "开始数目";
              this.canEnd = false;
              this.$socket.emit("resultGame", {
                userId: this.account.user.name,
                gameId: this.game_id,
                result: this.games.result,
                turn: this.games.turn
              });
            }
          })
          .catch(err => {
            // An error occurred
          });
      }

      // this.score_selected = !this.score_selected;
    },
    test() {
      alert(this.game_id);
      // this.$refs["modal"].show();
      // alert(testStore());
      // alert(getKifu());
      /*  var timeoutCallback = require("timeout-callback");

      this.$socket.emit(
        "hello",
        {
          userId: this.account.user.name,
          gameId: this.game_id
        },
        timeoutCallback(function(err, arg1, arg2) {
          console.log("this log is always displayed!");
        })
      ); */
    },
    //进入数子状态
    passed() {
      setPassedStatus();
      this.setResult("passed");
      this.btnPassedDisable = true;
      this.$socket.emit("passedGame", {
        userId: this.account.user.name,
        gameId: this.game_id
      });
    },
    getResult() {
      var result;
      if (this.account.user.name == this.game.blackone_id.name)
        result = "白中盘胜";
      else if (this.account.user.name == this.game.whiteone_id.name)
        result = "黑中盘胜";
      return result;
    },
    confirm() {
      setConfirm(true);
    },
    cancel() {
      setConfirm(false);
      this.isTurn = false;
    },
    //刷新，重新加载棋谱
    refresh() {
      // alert(this.game_id);
      // alert(this.$route.query.game_id);
      this.show = true;
      // let that = this;
      setTimeout(() => {
        this.$socket.emit("registerToRoom", this.$route.query.game_id);
        this.show = false;
      }, 1000);
      this.success("刷新成功！");
    },
    //开始按钮，认输按钮
    begin() {
      if (this.btnText == "开始") {
        // this.$refs.mygo.initVoice();
        console.log("game is begin,text is {}".format(this.btnText));
        this.btnText = "准备中";
        this.success("等待其他对局者进入对局！");
        this.$refs.quit.disabled = true;
        this.$socket.emit("prepareGame", {
          userId: this.account.user.name,
          gameId: this.game_id
        });
      } else if (this.btnText == "认输") {
        this.$bvModal
          .msgBoxConfirm("你想认输吗？", {
            title: "请确认",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "确定",
            cancelTitle: "取消",
            hideHeaderClose: false,
            centered: true
          })
          .then(value => {
            if (value) {
              var result = this.getResult();
              this.setResult(result);
              this.$socket.emit("resignGame", {
                userId: this.account.user.name,
                gameId: this.game_id,
                result: result
              });
            }
          })
          .catch(err => {
            // An error occurred
          });
      }
    },
    //退出当前对局室
    exit() {
      console.log(`${this.account.user.name} is me`);
      this.$socket.emit("logout", {
        userId: this.account.user.name,
        gameId: this.game_id
      });
      this.$router.push({ path: "/" });
    },

    checkResult(msg) {
      //判断是黑还是白，需要确定
      var result = this.matchResult(msg.result);
      this.$bvModal
        .msgBoxConfirm(result, {
          title: "请确认",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "确定",
          cancelTitle: "取消",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            //同意数子结果，对局结束
            this.$socket.emit("finishGame", {
              userId: this.account.user.name,
              gameId: this.game_id,
              result: result
            });
          } else {
            //不同意结果，继续数子
            this.$socket.emit("noagreeGame", {
              userId: this.account.user.name,
              gameId: this.game_id,
              result: "数子结果未达成一致，继续数目"
            });
            this.success("数子结果未达成一致，继续数目");
            this.canEnd = true;
            this.endText = "开始数目";
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    matchResult(value) {
      //正则表达式返回对局结果
      var _result = value.match(">([黑白]胜.*)<");
      if (_result) return _result[1];
      else return "";
    },
    //对局结束，保存棋谱
    _finishGame(msg) {
      this.error("对局结束： " + msg.result);
      EventBus.$emit("gameove", msg);
      console.log("game is over,result is {}".format(msg.result));
      this.btnQuitDisable = false;
      this.btnBeginDisable = true;
      // this.score_selected = false;
      this.canEnd = false;
      this.canBegin = false;
      document.getElementById("wgo-control").style.display = "";
      if (this.isOpponent) {
        let save_data = {
          black_info:
            this.game.blackone_id.name + "&" + this.game.blacktwo_id.name,
          white_info:
            this.game.whiteone_id.name + "&" + this.game.whitetwo_id.name,
          kifu_data: this.games.game.kifu,
          result: msg.result
        };

        gameService.saveKifu(save_data).then(data => {
          this.success(data.message);
        });

        gameService.completeGame(this.game_id).then(msg => {
          console.log(msg);
        });
      }
    },
    //显示手数功能
    toggleMarker() {
      showMarker();
    },
    //显示该谁下棋了
    who() {
      var turn = getWhichTurn();
      if (turn == 0) {
        alert(this.game.blackone_id.name + " =》该他下棋了！");
      } else if (turn == 1) {
        alert(this.game.whiteone_id.name + " =》该他下棋了！");
      } else if (turn == 2) {
        alert(this.game.blacktwo_id.name + " =》该他下棋了！");
      } else if (turn == 3) {
        alert(this.game.whitetwo_id.name + " =》该他下棋了！");
      }
    },
    //悔棋功能
    regret() {
      this.$bvModal
        .msgBoxConfirm("你想申请悔棋吗？", {
          title: "请确认",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "确定",
          cancelTitle: "取消",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            // this.success("正在申请悔棋操作！");
            this.$socket.emit("regretGame", {
              userId: this.account.user.name,
              gameId: this.game_id,
              msg: this.account.user.name + "正在申请悔棋操作！"
            });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    //确认是否同意对方悔棋
    confirmRegret(data) {
      this.$bvModal
        .msgBoxConfirm("你同意对方悔棋吗？", {
          title: "请确认",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "确定",
          cancelTitle: "取消",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            // var msg = "=> 同意申请悔棋操作！";
            var msg = this.account.user.name + " => 同意申请悔棋操作！";
            this.$socket.emit("successRegretGame", {
              userId: data.userId,
              gameId: data.gameId,
              msg: msg
            });
            this.$socket.emit("updateRegretKifu", {
              gameId: data.gameId,
              kifu: getKifu()
            });
          } else {
            // var msg = "=> 不同意申请悔棋操作！";
            var msg = this.account.user.name + "=> 不同意申请悔棋操作！";
            this.$socket.emit("failRegretGame", {
              userId: data.userId,
              gameId: data.gameId,
              msg: msg
            });
          }
        })
        .catch(err => {
          // An error occurred
          console.log(err);
        });
    },
    //坐标显示
    toggleAll(checked) {
      toggleCoordinates(checked);
    },
    onCapture() {
      this.img = this.$refs.webrtc.capture();
    },
    onJoin() {
      alert("hello");
      this.$refs.webrtc.join();
    },
    onLeave() {
      this.$refs.webrtc.leave();
    },
    onShareScreen() {
      this.img = this.$refs.webrtc.shareScreen();
    },
    onError(error, stream) {
      console.log("On Error Event", error, stream);
    },
    logEvent(event) {
      console.log("Event : ", event);
    },
    hello(msg) {
      alert(msg);
      // removeUser(msg);
    }
  },
  sockets: {
    
    move(game) {
      readyMove(game);
      this.btnRegretDisable = true;
      this.updateGame(game);
    },
    //棋手对局进入准备状态
    prepare(msg) {
      this.success(msg);
    },

    //棋局正式开始
    beginGame(game) {
      this.success("对局正式开始");
      this.setButtonStatus();
      gameService.beginGame(this.game_id).then(msg => {
        console.log(msg);
      });
      initGameData(this.account.user.name, game);
      enable_board();
    },

    //棋局数目开始,黑1开始数目
    endGame(msg) {
      console.log("begin to end game");
      this.success(msg);
      if (this.account.user.name == this.game.blackone_id.name) {
        this.canEnd = true; //启用数目按钮
        this.endText = "开始数目";
      } else {
        this.canEnd = false;
      }
    },

    //是否同意对局结果
    resultGame(msg) {
      this.setTurn();
      this.success(msg.userId + "=>" + msg.result);
      if (
        this.games.turn == "white" && //需要白确认并且是白1
        this.account.user.name == this.game.whiteone_id.name
      ) {
        this.checkResult(msg);
      } else if (
        this.games.turn == "black" &&
        this.account.user.name == this.game.blackone_id.name //需要黑确认并且是黑1
      ) {
        this.checkResult(msg);
      }
    },
    //不同意悔棋申请
    failRegretGame(data) {
      this.success(data.msg);
    },
    //同意悔棋申请
    successRegretGame(data) {
      this.success(data.msg);
      regretCurrentGame();
    },
    // 接收悔棋操作的申请
    regretGame(data) {
      this.success(data.msg);
      if (
        getGameTurn() == 1 && //需要黑确认并且是黑1
        this.account.user.name == this.game.blackone_id.name
      ) {
        this.confirmRegret(data);
      } else if (
        getGameTurn() == -1 &&
        this.account.user.name == this.game.whiteone_id.name //需要白确认并且是白1
      ) {
        this.confirmRegret(data);
      }
    },

    //数子结束
    finishGame(msg) {
      this._finishGame(msg);
      console.log("game is over! result is " + msg.result);
    },

    helloMsg(msg) {
      alert("game is helloMsg " + msg);
    },

    //数子结果未得到双方认可
    noagreeGame(msg) {
      this.success(msg.result);
      this.setTurn();
      if (
        this.games.turn == "white" && //需要白确认并且是白1
        this.account.user.name == this.game.whiteone_id.name
      ) {
        this.canEnd = true; //启用数目按钮
        this.endText = "开始数目";
      } else if (
        this.games.turn == "black" &&
        this.account.user.name == this.game.blackone_id.name //需要黑确认并且是黑1
      ) {
        this.canEnd = true; //启用数目按钮
        this.endText = "开始数目";
      }
    },

    //棋局进入计算最终结果状态
    passed(msg) {
      this.success(msg);
    },

    //棋局正式结束
    resign(msg) {
      // this.success(msg);
      gameResign(msg.result);
      this._finishGame(msg);
    }
  },
  // props: ["game_id"],
  data() {
    return {
      status: "not_accepted",
      btnBeginDisable: false, //开始按钮的控制状态
      btnQuitDisable: false, //退出按钮的控制状态
      btnPassedDisable: false, //终局按钮的控制状态
      btnRegretDisable: true, //悔棋按钮的控制状态
      // score_selected: false, //数目按钮的控制状态
      btnText: "开始",
      isOpponent: false, //是否为对局者
      game: null, //本对局的对局信息
      gameUser: [], //本对局的对手信息
      userStatus: {}, //对局用户的准备状态
      currentUsers: [], //进入对局室的所有人
      canBegin: false, //是否可以开始新对局
      canEnd: false, //是否可以开始数目
      endText: "开始数目",
      kifu: "", //棋谱
      img: null,
      status: false,
      show: false,
      isTurn: false,
      game_id: ""
    };
  },
  beforeDestroy() {
    console.log("destroy is called");
    // this.$socket.removeAllListeners();
  },
  created() {
    //数子结束，双方达成一致
  },
  mounted() {
    // this.$socket.open();
    // this.$socket.on("helloMsg", this.hello);
    // this.$socket.removeAllListeners();
    this.game_id = this.$route.query.game_id;
    this.show = true;
    gameService.getById(this.game_id).then(data => {
      this.game = data;
      this.gameUser.push(this.game.blackone_id.name);
      this.gameUser.push(this.game.blacktwo_id.name);
      this.gameUser.push(this.game.whiteone_id.name);
      this.gameUser.push(this.game.whitetwo_id.name);
      /* this.userStatus[this.game.blackone_id] = false;
      this.userStatus[this.game.blacktwo_id] = false;
      this.userStatus[this.game.whiteone_id] = false;
      this.userStatus[this.game.whitetwo_id] = false; */
      //如果是对局者，给出提示信息
      this.isOpponent =
        this.gameUser.indexOf(this.account.user.name) != -1 ? true : false;
      if (this.isOpponent) {
        console.log("it is openent in game");

        if (this.game.status == "未开始") {
          this.success("对局者请点击开始按钮，进入对局！");
        } else if (this.game.status == "进行中") {
          this.success("对局成功恢复，请继续对局！");
          this.setButtonStatus();
        }
      } else {
        //观战者
        if (this.game.status == "未开始") {
          this.success("对局还未开始，准备中！");
        } else if (this.game.status == "进行中") {
          this.success("对局正在进行中，请欣赏对局！");

          this.$socket.emit("view", {
            userId: this.account.user.name,
            gameId: this.game_id
          });
        } else {
          //已结束
          this.success("对局已经结束！");
        }
      }
      this.updateNavTitle(this.game.name + "#" + this.$route.query.game_id);
      this.show = false;
      return data;
    });

    /* EventBus.$on("yourturn", () => {
      this.success("轮到你骡子了！");
    }); */

    EventBus.$on("confirmTurn", () => {
      this.isTurn = true; //打开确认取消按钮
    });

    EventBus.$on("move", game => {
      let that = this;
      this.$socket.emit(
        "move",
        game,
        timeoutCallback(function(err, response) {
          if (err) that.error("落子信息发送服务器不成功，请重新刷新再发送！");
          else if (response == "ok") {
            that.success("落子信息发送服务器成功!");
            that.isTurn = false;
          }
        })
      );
      this.btnRegretDisable = false;
      this.updateGame(game);
    });
    EventBus.$on("showScore", msg => {
      this.success(msg);
      this.setResult(msg);
    });
    //超时判负
    EventBus.$on("timeout", msg => {
      this.setResult(msg);
      this.error(msg);
      this.$socket.emit("resignGame", {
        userId: this.account.user.name,
        gameId: this.game_id,
        result: msg
      }); //发送信息
    });
  },
  components: {
    MyGo,
    Chat
  }
};
</script>
