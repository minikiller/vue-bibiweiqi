<template>
  <div id="app">
    <b-jumbotron>
      <b-container class="container-fluid">
        <b-row>
          <b-col>
            <div class="page" v-if="getSpinner">
              <b-spinner
                class="spinner"
                :variant="'primary'"
                :key="'primary'"
              ></b-spinner>
            </div>
            <Navbar v-if="games.showNav" />
            <notifications group="foo" position="top right" />
            <!-- <div
            v-if="alert.message"
            :class="`alert ${alert.type}`"
            v-html="alert.message"
            ></div>-->
            <br />
            <router-view></router-view>
          </b-col>
        </b-row>
      </b-container>
    </b-jumbotron>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Navbar from "../component/NavBar.vue";
export default {
  name: "app",
  computed: {
    ...mapGetters("room", ["getSpinner"]),
    ...mapState({
      alert: (state) => state.alert,
      games: (state) => state.games,
    }),
  },
  methods: {
    ...mapActions({
      clearAlert: "alert/clear",
    }),
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert();
    },
  },
  components: {
    Navbar,
  },
};
</script>

<style>
.jumbotron {
  padding: 0rem 0rem 2rem 0rem;
  margin: 0rem 0rem;
}
.navbar {
  padding: 0.25rem 1rem;
}
.col {
  padding: 0rem 0rem;
}
</style>
<style lang="scss">
.page {
  position: absolute;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 25;
  width: 100%;
  height: 100%;
}
.spinner {
  z-index: 26;
  position: relative;
  top: 50%;
}
.container-fluid {
  // margin: 2px !important;
  padding: 0 !important;
}
</style>
