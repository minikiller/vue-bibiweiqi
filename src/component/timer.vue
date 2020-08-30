<template>
  <div>
    <!-- <b-button @click="getCode">开始</b-button>
    <b-button @click="stopCode">停止</b-button>

    <div v-if="isMobile">
      <b-button @touchstart="load">load</b-button>
      <b-button @touchstart="play">play</b-button>
    </div>
    <div v-else>
      <b-button @click="load">load</b-button>
      <b-button @click="play">play</b-button>
    </div>-->

    <!-- <br />
    <span v-show="!show" class="count">时间: 00:00:{{ count }}</span>
    <br />-->
    <span v-show="!show">
      <h6>读秒:30秒{{ numbers }}次</h6>
    </span>
    <audio id="audioOne"></audio>
    </div>
</template>

<script>
import { gameService } from "../_services";
import config from "config";
import { isPc, set_b_number, set_w_number, clear_minute } from "../_helpers";
import { mapState, mapMutations } from "vuex";
import { EventBus } from "../index.js";

// 读秒组件效果演示
export default {
  name: "timer",
  props: {
    numbers: Number, //读秒次数
    count: String, //显示的读秒时间
  },
  data() {
    return {
      show: false,
      timer: null,
      time_count: 30,
      isMobile: false,
    };
  },
  mounted() {
    this.isMobile = !isPc();
    
  },
  computed: {
    ...mapState({
      games: (state) => state.games,
    }),
  },
  methods: {
    ...mapMutations("games", ["setBL", "setWL", "setB_number", "setW_number"]),
    stopCode() {
      clearTimeout(this.timer);
      console.log("timer is cleaned");
      this.count = this.time_count;
      this.timer = null;
    },
    load() {
      let that = this;
      gameService.moveVoice().then((data) => {
        let url = `${config.apiUrl}` + "/" + data.url;
        console.log(url);
        let audio = document.getElementById("audioOne");
        audio.src = url;
        // .setSrc(url);
        audio.load();
      });
    },
    play() {
      document.getElementById("audioOne").play();
    },
    
  },
};
</script>
