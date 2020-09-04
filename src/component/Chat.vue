<template>
  <div>
    <!-- <section id="chatroom" ref="chatroom">
      <section v-html="text"></section>
    </section>-->
    <audio id="audioChat"></audio>

    <b-card class="mt-5" header="聊天记录">
      <pre class="m-3" style="height: 10pc; overflow-y: scroll;" v-html="text"></pre>
    </b-card>

    <section id="input_zone">
      <b-form-input placeholder="Enter your msg" v-model="msg"></b-form-input>
      <div v-if="isMobile">
        <b-button variant="primary" @touchstart="send" :disabled="!account.status.loggedIn">
          <i class="fas fa-user-friends"></i> 发送
        </b-button>
      </div>
      <div v-else>
        <b-button variant="primary" @click="send" :disabled="!account.status.loggedIn">
          <i class="fas fa-user-friends"></i> 发送
        </b-button>
      </div>
    </section>
  </div>
</template>
<script>
import { initGame, beginGame, isPc } from "../_helpers";
import { mapState, mapMutations } from "vuex";
import { gameService } from "../_services";
import config from "config";

export default {
  name: "chat",
  props: {
    gameId: String,
    gameInfo: null,
  },
  computed: {
    ...mapState({
      account: (state) => state.account,
      users: (state) => state.users.all,
    }),
  },
  mounted() {
    // this.$socket.emit(this.gameId); //进入gameId的房间
    //发送登陆消息给服务器
    this.isMobile = !isPc();
    this.$socket.emit("login", {
      userId: this.account.user.name,
      gameId: this.gameId,
      gameInfo: this.gameInfo,
    });
  },
  data() {
    return {
      msg: "",
      text: "",
      _socket: null,
      isMobile: false,
    };
  },
  methods: {
    ...mapMutations("games", ["addUser", "deleteUser", "clearUser"]),
    send() {
      if (this.msg) {
        this.$socket.emit("new_message", {
          message: this.msg,
          gameId: this.gameId,
          avatar: this.account.user.avatar,
          username: this.account.user.name,
        });
        this.msg = "";
      }
    },
    getCurrentDate(format) {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      var day = now.getDay(); //得到周几
      var hour = now.getHours(); //得到小时
      var minu = now.getMinutes(); //得到分钟
      var sec = now.getSeconds(); //得到秒
      month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
      var time = "";
      //精确到天
      if (format == 1) {
        time = year + "-" + month + "-" + date;
      }
      //精确到分
      else if (format == 2) {
        time =
          year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
      }
      //精确到分
      else if (format == 3) {
        time = hour + ":" + minu + ":" + sec;
      }
      return time;
    },
  },
  sockets: {
    //通知新的用户进入房间
    joinlobby(user) {
      this.addUser(user);
      this.text =
        "<br><div class='badge badge-danger'>" +
        "系统:</div>" +
        "[" +
        this.getCurrentDate(3) +
        "]" +
        user +
        "进入对局室</br>" +
        this.text;
    },
    //初始化聊天室用户列表
    initGameUser(userlist) {
      this.clearUser();
      userlist.forEach((user) => {
        this.addUser(user);
      });
    },

    leavelobby(userId) {
      console.log("user id is leave room" + userId);
      this.deleteUser(userId);
      this.text =
        "<br><div class='badge badge-danger'>" +
        "系统:</div>" +
        "[" +
        this.getCurrentDate(3) +
        "]" +
        userId +
        "离开对局室</br>" +
        this.text;
    },

    get_message(data) {
      console.log("i get it " + data);
      this.text =
        "<div class='badge badge-info'>" +
        data.username +
        ":</div> " +
        "[" +
        this.getCurrentDate(3) +
        "]" +
        data.message +
        "\n" +
        this.text;
      gameService
        .chatVoice({ msg: data.message, username: data.username })
        .then((data) => {
          let url = `${config.apiUrl}` + "/" + data.url;
          console.log(url);
          let audio = document.getElementById("audioChat");
          audio.src = url;
          // .setSrc(url);
          audio.load();
          audio.play();
        });
    },
  },
};
</script>
<style>
.pre-scrollable {
  max-height: 340px;
  overflow-y: scroll;
}
</style>
