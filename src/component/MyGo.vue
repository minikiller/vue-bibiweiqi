<template>
  <div>
    <audio id="audioMove" src="/static/move.mp3" preload="auto"></audio>
    <audio id="audioDead" src="/static/deadone.mp3" preload="auto"></audio>
    <div class="container">
      <vue-baberrage
        :isShow="barrageIsShow"
        :barrageList="barrageList"
        :maxWordCount="maxWordCount"
        :throttleGap="throttleGap"
        :loop="barrageLoop"
        :boxHeight="boxHeight"
        :messageHeight="messageHeight"
      ></vue-baberrage>
    </div>
    <div style="width: 100%; margin: 0" ref="player"></div>
    <div>
      <b-card-group deck>
        <b-card header-tag="header" footer-tag="footer">
          <!-- <b-card-title>{{ blackOne }}</b-card-title> -->
          <!-- <template v-slot:header>
            <h6 class="mb-0">
              <b-avatar variant="info" :src="account.user.avatar"></b-avatar>
              {{ blackOne }}
            </h6>
            <div v-if="b1_turn" class="text-success">行棋</div>
          </template> -->
          <b-card-text>
            <b-row>
              <b-col class="col-8">
                <b-avatar variant="info" :src="account.user.avatar"></b-avatar>
                {{ blackOne }} <br/>
                <b-img src="/static/img/xingqi.png" fluid alt="Responsive image" width="59px"></b-img>
              </b-col>
              <b-col>
                <b-row>
                  <b-col>用时：{{ b_playTime }}</b-col>
                </b-row>
                <b-row>
                  <b-col>提子：</b-col>
                  <!-- <b-card-text>提子：</b-card-text> -->
                </b-row>
                <b-row>
                  <b-col>读秒: {{ b_playTime }}</b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card>

        <b-card header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <h6 class="mb-0">
              {{ whiteOne }}
              <div v-if="w1_turn" class="text-success">行棋</div>
            </h6>
          </template>
          <b-card-text>用时：{{ w_playTime }}</b-card-text>
          <b-card-text>提子：</b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <div class="mt-3">
      <b-card-group deck>
        <b-card header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <h6 class="mb-0">
              {{ blackTwo }}
              <div v-if="b2_turn" class="text-success">行棋</div>
            </h6>
          </template>
          <b-card-text>用时：{{ b_playTime }}</b-card-text>
          <b-card-text>提子：</b-card-text>
        </b-card>

        <b-card header-tag="header" footer-tag="footer">
          <template v-slot:header>
            <h6 class="mb-0">
              {{ whiteTwo }}
              <div v-if="w2_turn" class="text-success">行棋</div>
            </h6>
          </template>
          <b-card-text>用时：{{ w_playTime }}</b-card-text>
          <b-card-text>提子：</b-card-text>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import { initGame, initResumeGame, initGameData } from "../_helpers";
import { mapState, mapMutations } from "vuex";
import { vueBaberrage, MESSAGE_TYPE } from "vue-baberrage";
import { EventBus } from "../index.js";
export default {
  name: "mygo",
  components: {
    vueBaberrage
  },
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all,
      games: state => state.games
    }),
    b_playTime: function() {
      let time = this.BL;
      var min = Math.floor(time / 60);
      var sec = Math.round(time) % 60;
      return min + ":" + (sec < 10 ? "0" + sec : sec) + "";
    },
    w_playTime: function() {
      let time = this.WL;
      var min = Math.floor(time / 60);
      var sec = Math.round(time) % 60;
      return min + ":" + (sec < 10 ? "0" + sec : sec) + "";
    }
  },
  props: {
    total_time: String,
    blackOne: String,
    whiteOne: String,
    blackTwo: String,
    whiteTwo: String,
    gameStatus: String
  },
  data() {
    return {
      barrageIsShow: true,
      messageHeight: 3,
      boxHeight: 150,
      barrageLoop: false,
      maxWordCount: 3,
      throttleGap: 2000,
      currentId: 0,
      barrageList: [],
      avatar: "http://sunlingfeng.0431zy.com/1.png",
      BL: "", //黑棋剩余时间
      WL: "", //白棋剩余时间
      BN: "", //黑棋提子数
      WN: "", //白棋提子数
      b1_turn: false,
      w1_turn: false,
      b2_turn: false,
      w2_turn: false
    };
  },
  watch: {
    BL: function(newValue, oldValue) {},
    WL: function(newValue, oldValue) {}
  },
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"])
  },
  sockets: {
    get_message(data) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: data.avatar,
        msg: data.username + " => " + data.message,
        time: 10,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "normal"
      });
    },
    joinlobby(user) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: this.avatar,
        msg: "系统: " + user + "进入对局室",
        time: 10,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "red"
      });
    },
    leavelobby(data) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: this.avatar,
        msg: "系统: " + data + "离开对局室",
        time: 10,
        type: MESSAGE_TYPE.NORMAL,
        barrageStyle: "red"
      });
    },
    view(msg) {
      // this.success(msg);
      this.updateGame(msg.game);

      //观战
      initGameData(this.account.user.name, this.games.game);
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
      document.getElementById("wgo-control").style.display = "";
    }
  },
  mounted() {
    let that = this;
    this.BL = this.total_time;
    this.WL = this.total_time;
    EventBus.$on("w_timeout", value => {
      that.WL = value;
    });
    EventBus.$on("b_timeout", value => {
      that.BL = value;
    });

    EventBus.$on("myturn", value => {
      if (value == 0) {
        that.b1_turn = true;
        that.b2_turn = false;
        that.w1_turn = false;
        that.w2_turn = false;
      }
      if (value == 1) {
        that.b1_turn = false;
        that.b2_turn = false;
        that.w1_turn = true;
        that.w2_turn = false;
      }
      if (value == 2) {
        that.b1_turn = false;
        that.b2_turn = true;
        that.w1_turn = false;
        that.w2_turn = false;
      }
      if (value == 3) {
        that.b1_turn = false;
        that.b2_turn = false;
        that.w1_turn = false;
        that.w2_turn = true;
      }
    });
    // document.getElementById("wgo-control").style.display = "none";
    if (this.$route.query.type == "resume") {
      initGameData(this.account.user.name, this.games.game);
      initResumeGame(this.$refs.player, this.games.game, this.games.result);
    } else if (this.gameStatus == "未开始") {
      initGame(this.$refs.player, {
        total_time: this.total_time,
        blackOne: this.blackOne,
        blackTwo: this.blackTwo,
        whiteOne: this.whiteOne,
        whiteTwo: this.whiteTwo
      });
    }
  }
};
</script>
<style scoped>
@import "/static/wgo.player.css";
.container {
  display: inline-block;
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100vh;
}
</style>
