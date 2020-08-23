<template>
  <div>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>
    <b-input-group prepend="0" :append="maxStep" class="mt-3">
      <b-form-input type="range" min="0" :max="maxStep" v-model="steps" ref="input"></b-form-input>
    </b-input-group>
    <!-- <div>{{ kifu.kifu_data }}</div> -->
    <div>当前手数： {{ steps }}</div>
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
    <p v-html="result"></p>
    <div style="width: 90%; margin: 0" ref="player" class="mt-3"></div>
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
    };
  },
  mounted() {
    this.kifu = this.$route.params.game;
    kifuViewGame(this.$refs.player, this.kifu);
    document.getElementById("wgo-control").style.display = "";
    this.maxStep = getTotalStep();
    this.$refs.input.max = this.maxStep;
    this.$refs.input.min = 0;
    EventBus.$on("go_move", (msg) => {
      this.steps = msg;
    });
    EventBus.$on("showScore", (msg) => {
      this.result = msg;
    });
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
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
