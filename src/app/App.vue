<template>
  <b-jumbotron>
    <b-container fluid="xl">
      <b-row>
        <b-col>
          <Navbar />
          <div v-if="alert.message" :class="`alert ${alert.type}`" v-html="alert.message"></div>
          <br>
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
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions({
      clearAlert: "alert/clear"
    })
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert();
    }
  },
  components: {
    Navbar
  }
};
</script>