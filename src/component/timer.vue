<template>
  <div>
    <b-button @click="getCode">开始</b-button>
    <b-button @click="stopCode">停止</b-button>
    <b-button @click="load">load</b-button>
    <b-button @click="play">play</b-button>
    <br />
    <span v-show="!show" class="count">时间: 00:00:{{ count }}</span>
    <br />
    <span v-show="!show" class="count">读秒: 30秒 {{ numbers }}次</span>
    <audio id="audioOne"></audio>
    <audio id="audioMinute0" src="/static/voice/0.mp3" preload="auto"></audio>
    <audio id="audioMinute1" src="/static/voice/1.mp3" preload="auto"></audio>
    <audio id="audioMinute2" src="/static/voice/2.mp3" preload="auto"></audio>
    <audio id="audioMinute3" src="/static/voice/3.mp3" preload="auto"></audio>
    <audio id="audioMinute4" src="/static/voice/4.mp3" preload="auto"></audio>
    <audio id="audioMinute5" src="/static/voice/5.mp3" preload="auto"></audio>
    <audio id="audioMinute6" src="/static/voice/6.mp3" preload="auto"></audio>
    <audio id="audioMinute7" src="/static/voice/7.mp3" preload="auto"></audio>
    <audio id="audioMinute8" src="/static/voice/8.mp3" preload="auto"></audio>
    <audio id="audioMinute9" src="/static/voice/9.mp3" preload="auto"></audio>
    <audio id="audioMinute10" src="/static/voice/10.mp3" preload="auto"></audio>
    <audio id="audioMinute20" src="/static/voice/20.mp3" preload="auto"></audio>
    <audio id="audioMinuteBegin" src="/static/voice/begin.mp3" preload="auto"></audio>
    <audio id="audioMinuteEnd1" src="/static/voice/end1.mp3" preload="auto"></audio>
    <audio id="audioMinuteEnd2" src="/static/voice/end2.mp3" preload="auto"></audio>
  </div>
</template>

<script>
import { gameService } from "../_services";
import config from "config";
// 读秒组件效果演示
export default {
  name: "timer",
  data() {
    return {
      show: true,
      count: "",
      timer: null,
      numbers: 3,
      time_count: 30
    };
  },
  methods: {
    stopCode() {
      clearInterval(this.timer);
      this.count = this.time_count;
      this.timer = null;
    },
    load() {
      let that = this;
      gameService.createVoice().then(data => {
        let url = `${config.apiUrl}` + "/" + data.url;
        console.log(url);
       let audio= document.getElementById("audioOne");
        audio.src=url;
        // .setSrc(url);
        audio.load();
      });
    },
    play() {
      document.getElementById("audioOne").play();
    },
    getCode() {
      if (this.numbers == 1) {
        //最后一次读秒
        document.getElementById("audioMinuteEnd1").play();
      } else {
        document.getElementById("audioMinuteBegin").play();
      }
      if (!this.timer) {
        this.count = this.time_count;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= this.time_count) {
            this.count--;
            if (this.count == 20)
              document.getElementById("audioMinute20").play();
            else if (this.count == 10)
              document.getElementById("audioMinute10").play();
            else if (this.count >= 0 && this.count < 10) {
              document.getElementById("audioMinute" + this.count).play();
            }
            if (this.count == 0 && this.numbers == 3) {
              this.numbers--;
              this.count = this.time_count;
              setTimeout(
                "document.getElementById('audioMinuteEnd2').play()",
                1000
              );
            } else if (this.count == 0 && this.numbers == 2) {
              this.numbers--;
              this.count = this.time_count;
              setTimeout(
                "document.getElementById('audioMinuteEnd1').play()",
                1000
              );
            } else if (this.count == 0 && this.numbers == 1) {
              // this.show = true;
              this.numbers--;
              clearInterval(this.timer);
              this.timer = null;
              alert("you failed");
            }
          }
        }, 1000);
      }
    }
  }
};
</script>
