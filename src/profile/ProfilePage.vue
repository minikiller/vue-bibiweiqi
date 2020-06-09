<template>
  <div>
    <image-input v-model="avatar">
      <div slot="activator">
        <b-avatar size="150px" v-if="!avatar" class="grey lighten-3 mb-3">
          <span>Click to add avatar</span>
        </b-avatar>
        <b-avatar size="150px" v-else class="mb-3">
          <img :src="avatar.imageURL" />
        </b-avatar>
      </div>
    </image-input>
    <div v-if="avatar && saved == false">
      <b-button class="primary" @click="uploadImage" :loading="saving">保存头像</b-button>
    </div>
  </div>
</template>

<script>
import ImageInput from "../component/ImageInput.vue";
import { userService } from "../_services";
import { mapState, mapActions } from "vuex";
export default {
  name: "profile",
  data() {
    return {
      avatar: null,
      saving: false,
      saved: true,
      user: null
    };
  },
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  components: {
    ImageInput
  },
  watch: {
    avatar: {
      handler: function() {
        this.saved = false;
        console.log("it changed it ");
      },
      deep: true
    }
  },
  methods: {
    uploadImage() {
      this.saving = true;
      setTimeout(() => this.savedAvatar(), 1000);
    },
    savedAvatar() {
      this.account.user.avatar_base_64_str = this.getBase64Str(
        this.avatar.imageData
      );
      userService.change_avatar(this.account.user);
      this.saving = false;
      this.saved = true;
    },
    getBase64Str(imgData) {
      return imgData.replace(/^data:image\/\w+;base64,/, "");
    },
    init() {
      console.log(this.account.user);
      this.avatar = {};
      this.avatar.imageURL = this.account.user.avatar;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
