<template>
  <div>
    <section id="chatroom" ref="chatroom">
      <b-form-textarea
        id="textarea"
        v-model="text"
        placeholder="Show chat message..."
        rows="3"
        max-rows="6"
      ></b-form-textarea>
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

      this.text = this.text + this.account.user.name + ": " + this.msg + "\n";
      this.msg = "";
    }
  }
};
</script>