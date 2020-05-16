<template>
  <div>
    <section id="chatroom" ref="chatroom">
      <section v-html="text"></section>
    </section>

    <section id="input_zone">
      <b-form-input placeholder="Enter your msg" v-model="msg"></b-form-input>
      <b-button variant="primary" @click="send">Send</b-button>
    </section>
  </div>
</template>
<script>
import { initGame, beginGame, socket, socketServer } from "../_helpers";
import { mapState, mapActions } from "vuex";
import { EventBus } from "../../src/index";
export default {
  props: {
    gameId: String
  },
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  mounted() {
    this._socket = socket;
    //发送登陆消息给服务器
    socket.emit("login", {
      userId: this.account.user.name,
      gameId: this.gameId
    });
    socket.emit(this.gameId);//进入gameId的房间

    EventBus.$on("get_message", data => {
      if (data.gameId === this.gameId) {
        console.log("i get it " + data);
        this.text =
          this.text +
          "<div fontcolor='red'><b-badge>" +
          data.username +
          ": " +
          data.message +
          "</b-badge>: " +
          this.msg +
          "\n</div>";
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
    send() {
      console.log("get " + this.msg);

      this._socket.emit("new_message", {
        message: this.msg,
        gameId: this.gameId
      });

      this.text =
        this.text +
        "<div fontcolor='red'><b-badge>" +
        this.account.user.name +
        "</b-badge>: " +
        this.msg +
        "\n</div>";
      this.msg = "";
    }
  }
};
</script>