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
    socket.emit("login", this.account.user.name);
  },
  data() {
    return {
      msg: "",
      text: ""
    };
  },
  methods: {
    send() {
      console.log("get " + this.msg);

      socket.emit("new_message", {
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