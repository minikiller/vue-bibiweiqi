<template>
  <b-container fluid class="p-4 bg-dark">
    <b-tabs content-class="mt-3" @activate-tab="activate_tab">
      <b-tab active>
        <template v-slot:title>
          <i class="fas fa-home"></i> 对弈大厅
        </template>
        <div v-if="getDisplayGames.length">
          <b-row>
            <div
              id="my-table"
              v-for="(data, index) in getDisplayGames"
              v-bind:key="index"
              style="margin:0 auto;"
            >
              <b-col>
                <b-card tag="article" style="max-width: 20rem;" class="mb-2">
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
                  <b-card-text>{{ `创建时间:${data.create_date}` }}</b-card-text>
                  <b-card-text>
                    状态:
                    <b-badge v-if="data.status == '未开始'" variant="danger">{{ `${data.status}` }}</b-badge>
                    <b-badge
                      v-else-if="data.status == '进行中'"
                      variant="success"
                    >{{ `${data.status}` }}</b-badge>
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
          <!-- <div>this is {{getDisplayGames.length}}</div> -->
          <b-row align-v="center">
          <!-- <b-row align-v="center" v-if="getDisplayGames.length>=3"> -->
            <!-- <b-col cols="4"></b-col> -->
            <b-col></b-col>
            <b-col>
              <b-pagination
                v-model="currentPage"
                :total-rows="getRows"
                :per-page="perPage"
                @input="paginate"
              ></b-pagination>
            </b-col>
            <b-col></b-col>
            <!-- <b-col cols="4"></b-col> -->
            <!-- <p class="mt-3">Current Page: {{ currentPage }}</p> -->
          </b-row>
        </div>
        <div v-else>
          <h5>没有有效的对局信息</h5>
        </div>
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <i class="fas fa-user-lock"></i> 我的对局
        </template>
        <div v-if="filtergame.length">
          <b-row class="mb-3">
            <div
              id="my-table"
              v-for="(data, index) in filtergame"
              v-bind:key="index"
              style="margin:0 auto;"
            >
              <b-col>
                <b-card tag="article" style="max-width: 20rem;" class="mb-2">
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
                  <b-card-text>{{ `创建时间:${data.create_date}` }}</b-card-text>
                  <b-card-text>
                    状态:
                    <b-badge v-if="data.status == '未开始'" variant="danger">{{ `${data.status}` }}</b-badge>
                    <b-badge
                      v-else-if="data.status == '进行中'"
                      variant="success"
                    >{{ `${data.status}` }}</b-badge>
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
        </div>
        <div v-else>
          <h5>没有有效的对局信息</h5>
        </div>
      </b-tab>
      <!-- <b-tab>
        <template v-slot:title>
          <i class="fas fa-history"></i> 历史对局
        </template>
        <div v-if="getHistoryGames.length">
          <b-row>
            <div
              id="my-table"
              v-for="(data, index) in getHistoryGames"
              v-bind:key="index"
              style="margin:0 auto;"
            >
              <b-col l="4">
                <b-card tag="article" style="max-width: 20rem;" class="mb-2">
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
                  <b-card-text>{{ `预定时间:${data.create_date}` }}</b-card-text>
                  <b-card-text>{{ `创建时间:${data.create_date}` }}</b-card-text>
                  <b-card-text>
                    状态:
                    <b-badge v-if="data.status == '未开始'" variant="danger">{{ `${data.status}` }}</b-badge>
                    <b-badge
                      v-else-if="data.status == '进行中'"
                      variant="success"
                    >{{ `${data.status}` }}</b-badge>
                    <b-badge v-else variant="info">{{ `${data.status}` }}</b-badge>
                  </b-card-text>
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
        </div>
        <div v-else>
          <h5>没有有效的对局信息</h5>
        </div>
      </b-tab>-->
    </b-tabs>
  </b-container>
</template>
<script>
import { gameService } from "../_services";
import { mapState, mapMutations, mapGetters } from "vuex";
import { EventBus } from "../index.js";
export default {
  name: "card",
  data() {
    return {
      games: [],
      displaygames: [],
      perPage: 3,
      currentPage: 1,
      filtergame: [],
    };
  },
  mounted() {
    // this.getAllGames();
    this.getRecords();
    this.updateShowNav(true);
  },
  created() {},
  computed: {
    ...mapState({
      account: (state) => state.account,
    }),
    /* ...mapGetters({
      getRows: "room/getRows",
      getDisplayGames: "room/getDisplayGames"
    }), */
    ...mapGetters("room", [
      "getRows",
      "getDisplayGames",
      "getGames",
      "getHistoryGames",
    ]),

    playTime: function () {
      return this.getDisplayGames.map(function (item) {
        let time = item.total_time;
        var min = Math.floor(time / 60);
        var sec = Math.round(time) % 60;
        return min + "分钟";
        // return min + "分钟:" + (sec < 10 ? "0" + sec : sec) + "秒";
      });
    },
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
    ...mapMutations("games", ["updateShowNav"]),
    paginate(currentpage) {
      this.$store.dispatch("room/paginate", {
        currentPage: currentpage,
        perPage: this.perPage,
      });
    },
    async getRecords() {
      await this.$store.dispatch("room/fetchGames");
      console.log(this.getDisplayGames);
    },
    async getHistoryRecords() {
      await this.$store.dispatch("room/fetchHistoryGames");
      console.log(this.getHistoryGames);
    },
    getMyRecords() {
      var filterGames = [];
      for (var i = 0; i < this.getGames.length; i++) {
        var blackone_id = this.getGames[i]["blackone_id"];
        var blacktwo_id = this.getGames[i]["blacktwo_id"];
        var whiteone_id = this.getGames[i]["whiteone_id"];
        var whitetwo_id = this.getGames[i]["whitetwo_id"];
        if (
          this.account.user.name == blackone_id ||
          this.account.user.name == blacktwo_id ||
          this.account.user.name == whiteone_id ||
          this.account.user.name == whitetwo_id
        ) {
          filterGames.push(this.getGames[i]);
        }
      }
      this.filtergame = filterGames;
      console.log(this.getGames);
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
          centered: true,
        })
        .then((value) => {
          if (value) {
            // console.log(id);
            gameService.deleteById(id).then((data) => {
              this.getRecords();
              this.success(data.message);
            });
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    activate_tab(newTabIndex) {
      console.log("new tab index is " + newTabIndex);
      if (newTabIndex == 0) this.getRecords();
      else if (newTabIndex == 1) this.getMyRecords();
      else this.getHistoryRecords();
    },
  },
};
</script>
