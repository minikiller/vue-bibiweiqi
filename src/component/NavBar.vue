<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="success">
      <b-container>
        <b-navbar-brand href="#">{{games.navTitle}}</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <!-- <b-nav-form>
                  <b-form-input 
                    size="sm" 
                    class="mr-sm-2" 
                    placeholder="Search for a meal"
                    v-model="meal"
                    ></b-form-input>
                  <b-button 
                    size="sm" 
                    class="my-2 my-sm-0" 
                    type="submit" 
                    @click.prevent="getMeal"
                    >Search</b-button>
            </b-nav-form>-->
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template slot="button-content">
                <em>{{account.user.name}}</em>
              </template>
              <b-dropdown-item>
                <router-link :to="{ path: '/'}" replace>home</router-link>
              </b-dropdown-item>              
              <b-dropdown-item>
                <router-link :to="{ path: '/game'}" replace>new game</router-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <router-link :to="{ path: '/profile'}" replace>Profile</router-link>
              </b-dropdown-item>
              <b-dropdown-item href="/kifu">
                Kifu
                <!-- <router-link :to="{ path: '/kifu'}" replace>Kifu</router-link> -->
              </b-dropdown-item>
              <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { userService } from "../_services";
export default {
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  data() {
    return {
      meal: ""
    };
  },
  methods: {
    getMeal() {
      //   ...
    },
    logout() {
      userService.logout();
      location.reload(true);
    }
  }
};
</script>

