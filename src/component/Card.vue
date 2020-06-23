<template>
  <b-container>
    <div v-if="games.length">
      <b-row>
        <div
          id="my-table"
          v-for="(data, index) in displaygames"
          v-bind:key="index"
          style="margin:0 auto;"
        >
          <b-col l="4">
            <b-card
              img-src="/static/images.jpg"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-card-title>{{data.name}}#{{data.id}}</b-card-title>
              <b-card-text>
                <div v-if="account.user.name == data.blackone_id">
                  <b-avatar variant="dark" :src="data.avatar" size="sm" />
                  <b-badge variant="success">{{ `${data.blackone_id}` }}</b-badge>
                </div>
                <div v-else>
                  <b-avatar variant="dark" :src="data.avatar" size="sm" />
                  {{ `${data.blackone_id}` }}
                </div>
              </b-card-text>
              <b-card-text>
                <div v-if="account.user.name == data.whiteone_id">
                  <b-avatar variant="light" :src="data.avatar" size="sm" />
                  <b-badge variant="success">{{ `${data.whiteone_id}` }}</b-badge>
                </div>
                <div v-else>
                  <b-avatar variant="light" :src="data.avatar" size="sm" />
                  {{ `${data.whiteone_id}` }}
                </div>
              </b-card-text>
              <b-card-text>
                <div v-if="account.user.name == data.blacktwo_id">
                  <b-avatar variant="dark" :src="data.avatar" size="sm" />
                  <b-badge variant="success">{{ `${data.blacktwo_id}` }}</b-badge>
                </div>
                <div v-else>
                  <b-avatar variant="dark" :src="data.avatar" size="sm" />
                  {{ `${data.blacktwo_id}` }}
                </div>
              </b-card-text>
              <b-card-text>
                <div v-if="account.user.name == data.whitetwo_id">
                  <b-avatar variant="light" :src="data.avatar" size="sm" />
                  <b-badge variant="success" m4>{{ `${data.whitetwo_id}` }}</b-badge>
                </div>
                <div v-else>
                  <b-avatar variant="light" :src="data.avatar" size="sm" />
                  {{ `${data.whitetwo_id}` }}
                </div>
              </b-card-text>
              <b-card-text>对局时长:{{ playTime[index] }}</b-card-text>
              <!-- <b-card-text>{{ `预定时间:${data.create_date}` }}</b-card-text> -->
              <!-- <b-card-text>{{ `创建时间:${data.dur_date}` }}</b-card-text> -->
              <b-card-text>
                状态:
                <b-badge v-if="data.status == '未开始'" variant="danger">{{ `${data.status}` }}</b-badge>
                <b-badge v-else-if="data.status == '进行中'" variant="success">{{ `${data.status}` }}</b-badge>
                <b-badge v-else variant="info">{{ `${data.status}` }}</b-badge>
              </b-card-text>
              <!-- TODO add status check -->
              <!-- <b-card-text>{{ `备注:${data.comment.slice(0,100)}` }}</b-card-text> -->
              <router-link :to="{ path: '/play',query: {game_id:data.id}}">
                <b-button variant="primary">
                  <b-icon icon="house-door-fill"></b-icon>进入
                </b-button>
              </router-link>
              <b-button
                v-if="account.user.user_id == data.user_id||account.user.isadmin==true"
                variant="primary"
                @click="delGame(data.id)"
              >删除</b-button>
            </b-card>
          </b-col>
        </div>
      </b-row>
      <b-row align-v="center">
        <b-col cols="4"></b-col>
        <b-col cols="4">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            @input="paginate"
          ></b-pagination>
        </b-col>
        <b-col cols="4"></b-col>
        <!-- <p class="mt-3">Current Page: {{ currentPage }}</p> -->
      </b-row>
    </div>
    <div v-else>
      <h5>数据加载中</h5>
    </div>
  </b-container>
</template>
<script>
import { gameService } from "../_services";
import { mapState, mapMutations } from "vuex";
import { EventBus } from "../index.js";
export default {
  name: "card",
  data() {
    return {
      games: [],
      displaygames: [],
      perPage: 3,
      currentPage: 1
    };
  },
  mounted() {
    this.getAllGames();
  },
  created() {},
  computed: {
    ...mapState({
      account: state => state.account
    }),
    rows() {
      return this.games.length;
    },
    playTime: function() {
      return this.games.map(function(item) {
        let time = item.total_time;
        var min = Math.floor(time / 60);
        var sec = Math.round(time) % 60;
        return min + "分钟:" + (sec < 10 ? "0" + sec : sec) + "秒";
      });
    }
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
    paginate(currentpage) {
      const starter = (currentpage - 1) * this.perPage;
      this.displaygames = this.games.slice(starter, starter + this.perPage);
    },
    getAllGames() {
      gameService.getAll().then(data => {
        this.games = data.games;
        this.displaygames = this.games.slice(0, this.perPage);
        EventBus.$emit("loading", false);
        return data;
      });
    },
    //正在进行的对局室不允许删除

    delGame(id) {
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want to delete everything.", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            // console.log(id);
            gameService.deleteById(id).then(data => {
              this.getAllGames();
              this.success(data.message);
            });
          }
        })
        .catch(err => {
          // An error occurred
        });
    }
  }
};
</script>
