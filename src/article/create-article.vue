<template>
    <div id="create-article">
        <h1>Create Article</h1>

        <p><router-link :to="{ name: 'AllArticle' }">Return to articles</router-link></p>

        <notification v-bind:notifications="notifications"></notification>
        <!-- <form> -->
        <form v-on:submit.prevent="addArticle">

            <div class="form-group">
                <label name="article_title">Title</label>
                <input type="text" class="form-control" v-model="article.title" id="article_title" required>
            </div>

            <div class="form-group">
                <label name="article_content">Content</label>
                <input type="text" class="form-control" v-model="article.content" id="article_content" required>
            </div>

            <div class="form-group">
                <label name="article_thumbnail">Thumbnail</label>
                <div v-if="!image">
                Select an image
                        <input type="file" class="form-control" @change="onFileChange">
                </div>
                <div v-else>
                    <img :src="image" />
                    <button @click="removeImage">Remove image</button>
                </div>
                <!-- <input type="text" class="form-control" v-model="article.thumbnail" id="article_thumbnail" required> -->
            </div>

            <div class="form-group">
                <button class="btn btn-primary">Create</button>
            </div>
        </form>
    </div>
</template>

<script>

import Notification from './notifications.vue';
import { userService } from "../_services";
export default{
    data(){
        return{
            article:{},
            notifications:[],
            image: '',
        }
    },
    methods: {
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.article.file = files[0];
            this.createImage(files[0]);
            },
            createImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (e) => {
                vm.image = e.target.result;
            };
            reader.readAsDataURL(file);
            },
            removeImage: function (e) {
            this.image = '';
            },

        addArticle: function()
        {
            var formData = new FormData();
            formData.append('title', this.article.title);
            formData.append('content', this.article.content);
            formData.append('file', this.article.file);
            
            if(this.notifications) this.notifications = [];
            if (this.image) this.$http.post('http://localhost:5000/article', formData, {
                headers : {
                    'enctype' : 'multipart/form-data'
                }
            }).then((response) => {
                this.notifications.push({
                    type: 'success',
                    message: 'Article created successfully'
                });
            }, (response) => {
                this.notifications.push({
                    type: 'error',
                    message: 'Article not created'
                });
            });
        }
    },
    components: {
        'notification' : Notification
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
button {
  
}
</style>
