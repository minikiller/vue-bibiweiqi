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
export default {
  props: {
    total_time: String,
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String
  },
  data() {
    return { myplayer: object ,myboard:object};
  },
  methods: {
    begin() {
      _ev_move = _ev_move || edit_board_mouse_move.bind(this.myboard);
      _ev_out = _ev_out || edit_board_mouse_out.bind(this.myboard);
      _ev_click = _ev_click || play.bind(this.myboard);
      this.myboard.addEventListener("mousemove", _ev_move);
      this.myboard.addEventListener("click", _ev_click);
      this.myboard.addEventListener("mouseout", _ev_out);
    }
  },
  mounted() {
    this.myplayer = new WGo.BasicPlayer(this.$refs.player, {
      sgf:
        "(;SZ[19]TM[" +
        this.total_time +
        "]KM[7.5]" +
        "PB[" +
        this.blackOne +
        "&" +
        this.blackTwo +
        "]PW[" +
        this.whiteOne +
        "&" +
        this.whiteTwo +
        "])",
      enableWheel: false,
      enableKeys: false
      // move: 1000
    });
    this.myboard=this.myplayer.board;
  }
};
</script>