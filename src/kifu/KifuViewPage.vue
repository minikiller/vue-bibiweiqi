<template>
  <div>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>
    <b-input-group prepend="0" :append="maxStep" class="mt-3">
      <b-form-input type="range" min="0" :max="maxStep" v-model="steps" ref="input"></b-form-input>
    </b-input-group>
    <!-- <div>{{ kifu.kifu_data }}</div> -->
    <div>step is {{ steps }}</div>
    <b-button
      variant="primary"
      v-model="status"
      value="true"
      @click="toggleAll"
      v-b-popover.hover.top="'切换棋盘的坐标!'"
    >坐标</b-button>
    <b-button variant="primary" @click="toggleMarker" v-b-popover.hover.top="'显示不同的手数!'">手数</b-button>
    <div style="width: 100%; margin: 0" ref="player" class="mt-3"></div>
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
  showMarker
} from "../_helpers";
export default {
  name: "KifuViewPage",
  data() {
    return {
      steps: 0,
      maxStep: 40,
      minStep: 0,
      kifu: Object
    };
  },
  mounted() {
    this.kifu = this.$route.params.game;
    kifuViewGame(this.$refs.player, this.kifu);
    document.getElementById("wgo-control").style.display = "";
    this.maxStep = getTotalStep();
    this.$refs.input.max = this.maxStep;
    this.$refs.input.min = 0;
  },
  methods: {
    //坐标显示
    toggleAll(checked) {
      toggleCoordinates(checked);
    },
    //显示手数功能
    toggleMarker() {
      showMarker();
    }
  },
  watch: {
    steps: {
      handler: function(value) {
        gotoStep(parseInt(value));
      },
      deep: true
    }
  },
  components: {
    // MyGo,
  }
};
</script>
<style scoped>
@import "/static/wgo.player.css";
</style>
