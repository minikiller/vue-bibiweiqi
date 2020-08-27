<template>
  <div>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>

    <b-button
      variant="primary"
      v-model="status"
      value="true"
      @click="toggleAll"
      v-b-popover.hover.top="'切换棋盘的坐标!'"
    >坐标</b-button>
    <b-button
      variant="primary"
      v-if="!isOpponent"
      @click="beginTry"
      v-b-popover.hover.top="'试下几手'"
    >{{try_text}}</b-button>
    <b-button variant="primary" @click="toggleMarker" v-b-popover.hover.top="'显示不同的手数!'">手数</b-button>
    <b-button variant="primary" @click="score" v-b-popover.hover.top="'形式判断!'">{{ endText }}</b-button>

    <b-button variant="primary" @click="back" v-b-popover.hover.top="'返回上一级!'">返回</b-button>
    <b-row align-v="center">
      <b-col sm="12" md="6">
        <b-input-group prepend="0" :append="maxStep" class="mt-3">
          <b-form-input type="range" min="0" :max="maxStep" v-model="steps" ref="input"></b-form-input>
        </b-input-group>
        <!-- <div>{{ kifu.kifu_data }}</div> -->
        <div>当前手数: {{ steps }};行棋人: {{ currentTurn }}</div>
        <div style="width: 100%; margin: 0" ref="player" class="mt-3"></div>
      </b-col>
      <b-col sm="12" md="6">
        <b-card
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
          border-variant="danger"
          header="对局信息"
          header-border-variant="danger"
          header-text-variant="danger"
          align="center"
        >
          <b-card-text>
            <p>
              <i v-if="b1_turn" class="fas fa-user"></i>
              黑方1:{{black1}}
            </p>
            <p>
              <i v-if="w1_turn" class="fas fa-user"></i>
              白方1:{{white1}}
            </p>
            <p>
              <i v-if="b2_turn" class="fas fa-user"></i>
              黑方2:{{black2}}
            </p>
            <p>
              <i v-if="w2_turn" class="fas fa-user"></i>
              白方2:{{white2}}
            </p>
            <p>结果:{{kifu.result}}</p>
            <p>时间:{{kifu.create_date}}</p>
            <p v-html="result"></p>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <!-- <my-go /> -->
  </div>
</template>

<script>
// import MyGo from "../component/MyGo";
import {
  kifuViewGame,
  gotoStep,
  getTotalStep,
  toggleCoordinates,
  showMarker,
  enable_try,
  disable_try,
  showViewScore,
} from "../_helpers";
import { EventBus } from "../index.js";
import { mapState, mapMutations } from "vuex";

export default {
  name: "KifuViewPage",
  data() {
    return {
      bTry: true,
      steps: 0,
      maxStep: 40,
      minStep: 0,
      try_text: "试下",
      kifu: Object,
      endText: "开始数目",
      result: "",
      black1: "",
      black2: "",
      white1: "",
      white2: "",
      b1_turn: false,
      b2_turn: false,
      w1_turn: false,
      w2_turn: false,
      currentTurn: "",
    };
  },
  mounted() {
    this.kifu = this.$route.params.game;
    if (this.kifu) {
      this.getGameinfo();
      kifuViewGame(this.$refs.player, this.kifu);
      document.getElementById("wgo-control").style.display = "";
      this.maxStep = getTotalStep();
      this.$refs.input.max = this.maxStep;
      this.$refs.input.min = 0;
    } else {
      //如果没有棋谱数据，返回棋谱列表
      this.$router.push({
        path: `/kifu`,
      });
    }
    EventBus.$on("go_move", (msg) => {
      this.steps = msg;
      this.getTurn(msg);
    });
    EventBus.$on("showScore", (msg) => {
      this.result = msg;
    });
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
    //显示当前的落子是谁下的
    getTurn(steps) {
      if (steps == 0) {
        this.currentTurn = "";
        return;
      }
      var turn = parseInt(steps) % 4;
      EventBus.$emit("myturn", turn);
      if (turn == 0) {
        this.b1_turn = false;
        this.b2_turn = false;
        this.w1_turn = false;
        this.w2_turn = true;
        this.currentTurn = this.white2;
      } else if (turn == 1) {
        this.b1_turn = true;
        this.b2_turn = false;
        this.w1_turn = false;
        this.w2_turn = false;
        this.currentTurn = this.black1;
      } else if (turn == 2) {
        this.b1_turn = false;
        this.b2_turn = false;
        this.w1_turn = true;
        this.w2_turn = false;
        this.currentTurn = this.white1;
      } else if (turn == 3) {
        this.b1_turn = false;
        this.b2_turn = true;
        this.w1_turn = false;
        this.w2_turn = false;
        this.currentTurn = this.black2;
      }
    },
    getGameinfo() {
      var black = this.kifu.black_info.split("&");
      this.black1 = black[0];
      this.black2 = black[1];
      var white = this.kifu.white_info.split("&");
      this.white1 = white[0];
      this.white2 = white[1];
    },
    score() {
      if (this.endText == "开始数目") {
        this.endText = "结束数目";
        showViewScore(false);
      } else if (this.endText == "结束数目") {
        this.endText = "开始数目";
        this.result = "";
        showViewScore(true);
      }
    },

    beginTry() {
      if (this.bTry) {
        enable_try();
        this.bTry = false;
        this.try_text = "结束";
      } else {
        disable_try();
        this.bTry = true;
        this.try_text = "试下";
      }
    },
    //坐标显示
    toggleAll(checked) {
      toggleCoordinates(checked);
    },
    //显示手数功能
    toggleMarker() {
      showMarker();
    },
    back() {
      this.$router.push({
        path: `/kifu`,
      });
    },
  },
  watch: {
    steps: {
      handler: function (value) {
        gotoStep(parseInt(value));
      },
      deep: true,
    },
  },
  components: {
    // MyGo,
  },
};
</script>
<style scoped>
@import "/static/wgo.player.css";
</style>
