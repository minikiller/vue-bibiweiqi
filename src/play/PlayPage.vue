<template>
  <div>
    <b-container class="bv-example-row" width="100%">
      <b-row>
        <b-col cols="8">
          <h2>
            <b-badge v-if="game">{{game.name}}--->{{account.user.name}}</b-badge>
          </h2>
          <div class="form-group">
            <button
              v-if="isOpponent"
              aria-pressed="true"
              class="btn btn-primary"
              @click="begin"
            >{{btnText}}</button>
            <!-- <button class="btn btn-primary" @click="login">login</button> -->
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
              <video :gameId="game_id"></video>
            </b-tab>
            <b-tab title="聊天" active>
              <chat v-if="game" :gameId="game_id" :gameInfo="game" />
            </b-tab>
            <b-tab title="观众">
              <b-list-group v-for="(user, index) in games.onlineUsers" :key="index">
                <b-list-group-item>{{user}}</b-list-group-item>
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
import Video from "../component/Video";
import { gameService } from "../_services";
import { EventBus } from "../../src/index";
import { mapState, mapMutations } from "vuex";
import { socket, enable_board, initGameData } from "../_helpers";

export default {
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
    begin() {
      
      if (this.btnText == "开始") {
        console.log("game is begin,text is {}".format(this.btnText))
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
    }
  },
  props: ["game_id"],
  data() {
    return {
      btnText: "开始",
      _socket: null,
      isOpponent: false,
      game: null,
      gameUser: [], //本对局的对手信息
      userStatus: {}, //对局用户的准备状态
      currentUsers: [], //进入对局室的所有人
      canBegin: false, //是否可以开始新对局
      kifu: "" //棋谱
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
      // this.success(msg);
      this.clear();
      this.btnText = "认输";
      initGameData(this.account.user.name, game);
      enable_board();
    });

    //棋局正式结束
    EventBus.$on("resign", msg => {
      // this.success(msg);
      //TODO send kifu to server msg.kifu
      this.error(msg.result);
      console.log("game is over,result is {}".format(msg.result))
      this.$refs.quit.disabled = false;
    });
  },
  components: {
    MyGo,
    Chat,
    Video
  }
};
</script>