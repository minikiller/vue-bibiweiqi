<template>
  <div id="all-article">
    <h1>All Article</h1>

    <p>
      <router-link :to="{ name: 'CreateArticle' }" class="btn btn-primary"
        >Create Article</router-link
      >
    </p>

    <div class="form-group">
      <input
        type="text"
        name="search"
        v-model="articleSearch"
        placeholder="Search article"
        class="form-control"
        v-on:keyup="searchArticles"
      />
    </div>

    <table class="table table-hover" style="width: 100%;">
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>mobile</td>
          <td>rank</td>
          <td>Thumbnail</td>
          <td>Win</td>
          <td>Fail</td>
          <td>Admin</td>
          <td>Date Created</td>
          <td>Actions</td>
        </tr>
      </thead>

      <tbody>
        <tr v-for="article in articles">
          <td>{{ article.public_id }}</td>
          <td>{{ article.name }}</td>
          <td>{{ article.mobile }}</td>
          <td>{{ article.rank }}</td>
          <td><img :src="article.avatar" width="50" height="50" /></td>
          <td>{{ article.win }}</td>
          <td>{{ article.fail }}</td>
          <td>{{ article.isadmin }}</td>
          <td>{{ article.create_date }}</td>
          <!-- <td>{{ article.date_created }}</td> -->
          <td>
            <router-link
              :to="{ name: 'EditArticle', params: { id: article.public_id } }"
              class="btn btn-primary"
              >Edit</router-link
            >
            <router-link
              :to="{ name: 'DeleteArticle', params: { id: article.public_id } }"
              class="btn btn-danger"
              >Delete</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import Punny from './Punny';
import { userService } from "../_services";

export default {
  data() {
    return {
      articles: [],
      originalArticles: [],
      articleSearch: "",
    };
  },
  created: function() {
    this.fetchArticleData();
  },
  methods: {
    fetchArticleData: function() {
      userService.getAll().then(
        (response) => {
          this.articles = response;
          this.originalArticles = this.articles;
          /* for (var i = 0; i < this.articles.length; i++) {
            this.articles[i].date_updated = new Date(
              this.articles[i].date_updated
            ).toString();
            this.articles[i].date_created = new Date(
              this.articles[i].date_created
            ).toString();
          } */
        },
        (response) => {}
      );
    },
    searchArticles: function() {
      if (this.articleSearch == "") {
        this.articles = this.originalArticles;
        return;
      }
      var searchedArticles = [];
      for (var i = 0; i < this.originalArticles.length; i++) {
        var articleTitle = this.originalArticles[i]["title"].toLowerCase();
        if (articleTitle.indexOf(this.articleSearch.toLowerCase()) >= 0) {
          searchedArticles.push(this.originalArticles[i]);
        }
      }
      this.articles = searchedArticles;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  /*color: #42b983;*/
}
#all-article {
  /*width: 400px;*/
  /*margin: 20px 20px 40px 40px;*/
  /*background-color: #66ffff;*/
  /*margin-top: 100px;
    margin-bottom: 100px;
    margin-right: 80px;
    margin-left: 80px;*/
}
</style>
