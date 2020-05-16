<template>
  <div>
    <b-container class="bv-example-row" width="100%">
      <b-row>
        <b-col cols="8">
          <h2>hello {{game_id}}</h2>
          <div>
            <my-go
              v-if="game"
              :blackOne="game.blackone_id"
              :whiteOne="game.whiteone_id"
              :blackTwo="game.blacktwo_id"
              :whiteTwo="game.whitetwo_id"
            />
          </div>
        </b-col>
        <b-col cols="4">
          <chat :gameId="game_id" />
          <b-list-group>
            <b-list-group-item href="http://apple.com">iPhone</b-list-group-item>
            <b-list-group-item>OnePlus 3T</b-list-group-item>
            <b-list-group-item>Samsung Galaxy 8</b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import MyGo from "../component/MyGo";
import Chat from "../component/Chat";
import { gameService } from "../_services";

export default {
  props: ["game_id"],
  data() {
    return {
      game: null,
      gameUser: [], //本对局的对手信息
      currentUsers: [], //对局室的当前人
      canBegin: Boolean, //是否可以进行对局
      kifu: "" //棋谱
    };
  },
  mounted() {
    gameService.getById(this.game_id).then(data => {
      this.game = data;
      this.gameUser.push(this.game.blackone_id);
      this.gameUser.push(this.game.blacktwo_id);
      this.gameUser.push(this.game.whiteone_id);
      this.gameUser.push(this.game.whitetwo_id);
      return data;
    });
  },
  components: {
    MyGo,
    Chat
  }
};
</script>