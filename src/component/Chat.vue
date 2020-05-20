<template>
  <div>
    <!-- <section id="chatroom" ref="chatroom">
      <section v-html="text"></section>
    </section>-->
    <b-card class="mt-5" header="聊天记录">
      <pre class="m-3" v-html="text"></pre>
    </b-card>

    <section id="input_zone">
      <b-form-input placeholder="Enter your msg" v-model="msg"></b-form-input>
      <b-button variant="primary" @click="send">Send</b-button>
    </section>
  </div>
</template>
<script>
import { initGame, beginGame, socket } from "../_helpers";
import { mapState, mapMutations } from "vuex";
import { EventBus } from "../../src/index";
export default {
  props: {
    gameId: String,
    gameInfo: null
  },
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  mounted() {
    this._socket = socket;
    socket.emit(this.gameId); //进入gameId的房间
    //发送登陆消息给服务器
    socket.emit("login", {
      userId: this.account.user.name,
      gameId: this.gameId,
      gameInfo: this.gameInfo
    });
    //通知新的用户进入房间
    EventBus.$on("joinlobbye", user => {
      this.addUser(user);
      this.text =
        this.text +
        "<br><div class='badge badge-danger'>" +
        "系统:</div>" +
        user +
        "进入聊天室</br>";
    });
    //初始化聊天室用户列表
    EventBus.$on("initGameUser", userlist => {
      userlist.forEach(user => {
        this.addUser(user);
      });
    });

    EventBus.$on("leavelobby", data => {
      console.log("user id is leave room" + data);
      this.deleteUser(data);
      this.text =
        this.text +
        "<br><div class='badge badge-danger'>" +
        "系统:</div>" +
        data +
        "离开聊天室</br>";
    });

    EventBus.$on("get_message", data => {
      if (data.gameId === this.gameId) {
        console.log("i get it " + data);
        this.text =
          this.text +
          "<div class='badge badge-info'>" +
          data.username +
          ":</div> " +
          data.message +
          "\n";
      }
    });
  },
  data() {
    return {
      msg: "",
      text: "",
      _socket: null
    };
  },
  methods: {
    ...mapMutations("games", ["addUser", "deleteUser"]),
    send() {
      if (this.msg) {
        this._socket.emit("new_message", {
          message: this.msg,
          gameId: this.gameId
        });
        this.text =
          this.text +
          "<div class='badge badge-info'>" +
          this.account.user.name +
          ":</div> " +
          this.msg +
          "\n";
        this.msg = "";
      }
    }
  }
};
</script>