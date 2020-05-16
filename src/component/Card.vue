<template>
  <b-container>
    <div v-if="games.length">
      <b-row>
        <div v-bind:key="data.index" v-for="data in games">
          <b-col l="4">
            <b-card
              v-bind:title="data.name"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-text>{{ `黑选手1:${data.blackone_id} => 白选手1:${data.whiteone_id}` }}</b-card-text>
              <b-card-text>{{ `黑选手2:${data.blacktwo_id} => 白选手2:${data.whitetwo_id}` }}</b-card-text>
              <b-card-text>{{ `对局时长:${data.total_time}` }}</b-card-text>
              <b-card-text>{{ `预定时间:${data.create_date}` }}</b-card-text>
              <b-card-text>{{ `创建时间:${data.dur_date}` }}</b-card-text>
              <b-card-text>{{ `备注:${data.comment.slice(0,100)}` }}</b-card-text>

              <router-link :to="{path:'/play/'+data.id}">
                <b-button variant="primary">进入房间</b-button>
              </router-link>
            </b-card>
          </b-col>
        </div>
      </b-row>
    </div>
    <div v-else>
      <h5>没有有效的预定对局😢</h5>
    </div>
  </b-container>
</template>
<script>
import { gameService } from "../_services";
export default {
  data() {
    return {
      games: []
    };
  },
  mounted() {
    gameService.getAll().then(data => {
      this.games = data.games;
      return data;
    });
  }
};
</script>
