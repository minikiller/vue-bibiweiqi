<template>
  <b-jumbotron>
    <b-container fluid>
      <b-row>
        <b-col>
          <Navbar />
          <div
            v-if="alert.message"
            :class="`alert ${alert.type}`"
            v-html="alert.message"
          ></div>
          <br />
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </b-jumbotron>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navbar from "../component/NavBar.vue";
export default {
  name: "app",
  computed: {
    ...mapState({
      alert: (state) => state.alert,
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
</style>
