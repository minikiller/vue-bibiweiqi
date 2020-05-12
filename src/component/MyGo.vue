<template>
  <div>
    <div class="form-group">
      <button class="btn btn-primary" @click="begin">Play</button>
      <button class="btn btn-primary" @click="begin">Play</button>
      <button class="btn btn-primary" @click="begin">Play</button>
      <div style="width: 100%; margin: 0" ref="player"></div>
    </div>
  </div>
</template>

<script>
import { initGame, beginGame } from "../_helpers";
export default {
  props: {
    total_time: String,
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String
  },
  data() {
    return {};
  },
  methods: {
    begin() {
      beginGame();
    }
  },
  mounted() {
    initGame(this.$refs.player, {
      total_time: this.total_time,
      blackOne: this.blackOne,
      blackTwo: this.blackTwo,
      whiteOne: this.whiteOne,
      whiteOne: this.whiteOne
    });
  }
};
</script>