<template>
  <div id="delete-product">
    <h1>Delete Article {{ article.title }}</h1>

    <p>
      <router-link :to="{ name: 'AllArticle' }">Return to articles</router-link>
    </p>

    <notification v-bind:notifications="notifications"></notification>

    <form v-on:submit.prevent="deleteArticle">
      <p><button class="btn btn-danger">Delete Article</button></p>
    </form>
  </div>
</template>

<script>
import Notification from "./notifications.vue";
import { userService } from "../_services";
export default {
  data() {
    return {
      article: {},
      notifications: [],
    };
  },

  created: function() {
    this.getArticle();
  },

  methods: {
    getArticle: function() {
      userService.getById(this.$route.params.id).then(
        (response) => {
          this.article = response;
        },
        (response) => {}
      );
    },

    deleteArticle: function() {
      if (this.notifications) this.notifications = [];
      userService.delete(this.$route.params.id)
        .then(
          (response) => {
            this.$router.push({ name: "AllArticle" });
          },
          (response) => {
            this.notifications.push({
              type: "danger",
              message: "Article could not deleted",
            });
          }
        );
    },
  },

  components: {
    notification: Notification,
  },
};
</script>
