<template>
  <div>
    <b-container class="bv-example-row" width="100%">
      <b-row>
        <b-col cols="8">
          <h2>
            <b-badge v-if="game">{{game.name}}--->{{account.user.name}}</b-badge>
          </h2>
          <div>
            <my-go
              v-if="game"
              :total_time="game.total_time"
              :blackOne="game.blackone_id"
              :whiteOne="game.whiteone_id"
              :blackTwo="game.blacktwo_id"
              :whiteTwo="game.whitetwo_id"
            />
          </div>
        </b-col>
        <b-col cols="4">
          <b-tabs content-class="mt-3" justified>
            <b-tab title="视频" active>
              <video />
            </b-tab>
            <b-tab title="聊天室" active>
              <chat :gameId="game_id" />
            </b-tab>
            <b-tab title="观众">
              <b-list-group v-for="(user, index) in games.onlineUsers" :key="index">
                <b-list-group-item>{{user}}</b-list-group-item>
              </b-list-group>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import MyGo from "../component/MyGo";
import Chat from "../component/Chat";
import Video from "../component/Video";
import { gameService } from "../_services";
import { EventBus } from "../../src/index";
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  methods: {
    
  },
  props: ["game_id"],
  data() {
    return {
      game: null,
      gameUser: [], //本对局的对手信息
      currentUsers: [], //进入对局室的所有人
      canBegin: Boolean, //是否可以开始新对局
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
    Chat,
    Video
  }
};
</script>