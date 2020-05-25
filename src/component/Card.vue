<template>
  <b-container>
    <div v-if="games.length">
      <b-row>
        <div v-bind:key="data.index" v-for="data in games">
          <b-col l="4">
            <b-card
              img-src="https://placekitten.com/1000/300"
              v-bind:title="data.name"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-text>
                <div v-if="account.user.name==data.blackone_id">
                  <b-avatar variant="dark" size="sm"/>
                  <b-badge variant="success" >{{ `${ data.blackone_id }` }}</b-badge>
                </div>
                <div v-else><b-avatar variant="dark" size="sm"/>{{ `${ data.blackone_id }` }}</div>
              </b-card-text>
              <b-card-text>
                <div v-if="account.user.name==data.whiteone_id">
                  <b-avatar variant="light" size="sm"/>
                  <b-badge variant="success">{{ `${ data.whiteone_id }` }}</b-badge>
                </div>
                <div v-else><b-avatar variant="light" size="sm"/>{{ `${ data.whiteone_id }` }}</div>
              </b-card-text>
              <b-card-text>
                <div v-if="account.user.name==data.blacktwo_id">
                  <b-avatar variant="dark" size="sm"/>
                  <b-badge variant="success">{{ `${ data.blacktwo_id }` }}</b-badge>
                </div>
                <div v-else><b-avatar variant="dark" size="sm"/>{{ `${ data.blacktwo_id }` }}</div>
              </b-card-text>
              <b-card-text>
                <div v-if="account.user.name==data.whitetwo_id">
                  <b-avatar variant="light" size="sm"/>
                  <b-badge variant="success" m4>{{ `${ data.whitetwo_id }` }}</b-badge>
                </div>
                <div v-else><b-avatar variant="light" size="sm"/>{{ `${ data.whitetwo_id }` }}</div>
              </b-card-text>
              <b-card-text>{{ `对局时长:${ data.total_time }` }}</b-card-text>
              <!-- <b-card-text>{{ `预定时间:${data.create_date}` }}</b-card-text> -->
              <!-- <b-card-text>{{ `创建时间:${data.dur_date}` }}</b-card-text> -->
              <b-card-text>
                状态:
                <b-badge v-if="data.status=='未开始'" variant="danger">{{ `${data.status}` }}</b-badge>
                <b-badge v-else-if="data.status=='进行中'" variant="success">{{ `${data.status}` }}</b-badge>
                <b-badge v-else variant="info">{{ `${data.status}` }}</b-badge>
              </b-card-text>
              <!-- TODO add status check -->
              <!-- <b-card-text>{{ `备注:${data.comment.slice(0,100)}` }}</b-card-text> -->

              <router-link :to="{path:'/play/'+data.id}">
                <b-button variant="primary">进入房间</b-button>
              </router-link>
              <b-button
                v-if="account.user.user_id==data.user_id"
                variant="primary"
                @click="delGame"
              >删除</b-button>
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
import { mapState, mapMutations } from "vuex";
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
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  methods: {
    // TODO add delete game method
    //正在进行的对局室不允许删除
    delGame() {
      alert("do");
    }
  }
};
</script>
