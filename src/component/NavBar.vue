<template>
  <b-navbar v-if="account.user" toggleable="lg" type="dark" variant="info">
    <b-container>
      <b-navbar-brand href="#">
        <b-img src="/static/img/logo.png" fluid alt="Responsive image" width="70px"></b-img>
        {{ games.navTitle }}
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/game">
            <i class="fas fa-user-plus"></i>新建對局
          </b-nav-item>
          <b-nav-item href="/">
            <i class="far fa-calendar-alt"></i>对局日程
          </b-nav-item>
          <b-nav-item href="/kifu">
            <i class="far fa-list-alt"></i>我的棋谱
          </b-nav-item>
          <b-nav-item href="/friend">
            <i class="fas fa-users"></i>我的棋友
          </b-nav-item>
          <b-nav-item href="/timer">
            <i class="fas fa-users"></i>读秒
          </b-nav-item>
          <b-nav-item href="/all-article" v-if="account.user.isadmin">
            <i class="fas fa-users"></i>用户维护
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form @submit.prevent="search">
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search" v-model="searchText"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>
                <b-avatar variant="info" :src="account.user.avatar"></b-avatar>
                {{ account.user.name }}[{{ account.user.rank }}]
              </em>
            </template>
            <b-dropdown-item href="/profile">
              <i class="fas fa-user-cog"></i>个人信息
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              <i class="fas fa-sign-out-alt"></i>退出
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <!--
              <template slot="button-content">
                {{ account.user.name }}
              </template>
              <b-dropdown-item>
                <router-link :to="{ path: '/' }" replace>首页</router-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <router-link :to="{ path: '/game' }" replace
                  >创建新游戏</router-link
                >
              </b-dropdown-item>
              <b-dropdown-item href="/kifu">
                我的棋谱
              </b-dropdown-item>
              <b-dropdown-item @click="logout">退出</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        -->
      </b-collapse>
    </b-container>
  </b-navbar>
</template>
<script>
import { mapState } from "vuex";
import { userService } from "../_services";
export default {
  name: "navBar",
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  data() {
    return {
      meal: "",
      searchText: ""
    };
  },
  methods: {
    search() {
      console.log(this.searchText);
      this.$store.dispatch("room/search", { text: this.searchText });
    },
    logout() {
      userService.logout();
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.li.navbar-text {
  padding: 8px;
}
</style>
