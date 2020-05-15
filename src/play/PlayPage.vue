<template>
  <div>
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
    <b-list-group>
      <b-list-group-item href="http://apple.com">iPhone</b-list-group-item>
      <b-list-group-item>OnePlus 3T</b-list-group-item>
      <b-list-group-item>Samsung Galaxy 8</b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import MyGo from "../component/MyGo";
import { gameService } from "../_services";

export default {
  props: ["game_id"],
  data() {
    return {
      game: null
    };
  },
  mounted() {
    gameService.getById(this.game_id).then(data => {
      this.game = data;
      return data;
    });
  },
  components: {
    MyGo
  }
};
</script>