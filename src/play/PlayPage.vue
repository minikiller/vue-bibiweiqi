<template>
  <div>
    <b-container class="bv-example-row" width="100%">
      <b-row>
        <b-col cols="8">
          <h2>
            <b-badge v-if="game">{{ game.name }}--->{{ account.user.name }}</b-badge>
          </h2>
          <div class="form-group">
            <button
              v-if="isOpponent"
              aria-pressed="true"
              class="btn btn-primary"
              @click="begin"
            >{{ btnText }}</button>
            <button class="btn btn-primary" v-if="canBegin" @click="getScore">数子</button>
            <button class="btn btn-primary" @click="exit" ref="quit">退出</button>
          </div>
          <my-go
            v-if="game"
            :total_time="game.total_time.toString()"
            :blackOne="game.blackone_id"
            :whiteOne="game.whiteone_id"
            :blackTwo="game.blacktwo_id"
            :whiteTwo="game.whitetwo_id"
          />
        </b-col>
        <b-col cols="4">
          <b-tabs content-class="mt-3" justified>
            <b-tab title="视频" active>
              <div class>
                <vue-webrtc
                  ref="webrtc"
                  width="100%"
                  :userId="account.user.name"
                  :roomId="game_id"
                  v-on:joined-room="logEvent"
                  v-on:left-room="logEvent"
                  v-on:open-room="logEvent"
                  v-on:share-started="logEvent"
                  v-on:share-stopped="logEvent"
                  @error="onError"
                />
              </div>
              <div class="row">
                <div class="col-md-12 my-3">
                  <button type="button" class="btn btn-primary" @click="onJoin">Join</button>
                  <button type="button" class="btn btn-primary" @click="onLeave">Leave</button>
                  <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button>
                  <button type="button" class="btn btn-primary" @click="onShareScreen">Share Screen</button>
                </div>
              </div>
              <!-- <my-video :gameId="game_id"></my-video> -->
            </b-tab>
            <b-tab title="聊天">
              <chat v-if="game" :gameId="game_id" :gameInfo="game" />
            </b-tab>
            <b-tab title="观众">
              <b-list-group v-for="(user, index) in games.onlineUsers" :key="index">
                <b-list-group-item>{{ user }}</b-list-group-item>
              </b-list-group>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import MyGo from "../component/MyGo";
import Chat from "../component/Chat";
import MyVideo from "../component/MyVideo";
import WebRTC from "../component/webrtc";
import { gameService } from "../_services";
import { EventBus } from "../../src/index";
import { mapState, mapMutations } from "vuex";
import { socket, enable_board, initGameData, showScore } from "../_helpers";

// import { WebRTC } from "plugin";
import { find, head } from "lodash";
import Vue from "vue";
Vue.component(WebRTC.name, WebRTC);

export default {
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
    // 显示分数
    getScore() {
      this.success(showScore());
      // this.score_selected = !this.score_selected;
    },
    begin() {
      if (this.btnText == "开始") {
        console.log("game is begin,text is {}".format(this.btnText));
        this.btnText = "准备中";
        this.success("等待其他对局者进入对局！");
        this.$refs.quit.disabled = true;
        this._socket.emit("prepareGame", {
          userId: this.account.user.name,
          gameId: this.game_id
        });
      } else if (this.btnText == "认输") {
        socket.emit("resign", {
          userId: this.account.user.name,
          gameId: this.game_id
        });
      }
    },
    exit() {
      console.log(`${this.account.user.name} is me`);
      socket.emit("logout", {
        userId: this.account.user.name,
        gameId: this.game_id
      });
      this.$router.push({ path: "/" });
    },
    onCapture() {
      this.img = this.$refs.webrtc.capture();
    },
    onJoin() {
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
    }
  },
  props: ["game_id"],
  data() {
    return {
      score_selected: false,
      btnText: "开始",
      _socket: null,
      isOpponent: false,
      game: null,
      gameUser: [], //本对局的对手信息
      userStatus: {}, //对局用户的准备状态
      currentUsers: [], //进入对局室的所有人
      canBegin: false, //是否可以开始新对局
      kifu: "", //棋谱
      img: null,
      roomId: "public-room"
    };
  },
  mounted() {
    this._socket = socket;
    gameService.getById(this.game_id).then(data => {
      this.game = data;
      this.gameUser.push(this.game.blackone_id);
      this.gameUser.push(this.game.blacktwo_id);
      this.gameUser.push(this.game.whiteone_id);
      this.gameUser.push(this.game.whitetwo_id);
      /* this.userStatus[this.game.blackone_id] = false;
      this.userStatus[this.game.blacktwo_id] = false;
      this.userStatus[this.game.whiteone_id] = false;
      this.userStatus[this.game.whitetwo_id] = false; */
      //如果是对局者，给出提示信息
      this.isOpponent =
        this.gameUser.indexOf(this.account.user.name) != -1 ? true : false;
      if (this.isOpponent) {
        console.log("it is openent in game");
        this.success("对局者请点击开始按钮，进入对局！");
      }
      return data;
    });
    //棋手对局进入准备状态
    EventBus.$on("prepare", msg => {
      this.success(msg);
    });
    //棋局正式开始
    EventBus.$on("beginGame", game => {
      this.success("对局正式开始");
      this.btnText = "认输";
      this.canBegin = true;
      initGameData(this.account.user.name, game);
      enable_board();
    });

    //棋局正式结束
    EventBus.$on("resign", msg => {
      // this.success(msg);
      //TODO send kifu to server msg.kifu
      this.error(msg.result);
      console.log("game is over,result is {}".format(msg.result));
      this.$refs.quit.disabled = false;
      let save_data = {
        black_info: this.game.blackone_id + "&" + this.game.blacktwo_id,
        white_info: this.game.whiteone_id + "&" + this.game.whitetwo_id,
        kifu_data: this.games.game.kifu,
        result: msg.result
      };
      gameService.saveKifu(save_data).then((data)=>{
        this.success(data);
      });

      /* kifu_data=data['kifu_data'], create_date=now_time,
                    user_id=current_user.id, black_info=data['black_info'],
                    white_info=data['white_info']*/
    });
  },
  components: {
    MyGo,
    Chat,
    MyVideo
  }
};
</script>
