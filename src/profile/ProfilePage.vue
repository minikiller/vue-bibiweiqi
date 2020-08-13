<template>
  <div>
    <b-container fluid>
      <b-tabs content-class="mt-3" @activate-tab="activate_tab">
        <b-tab active>
          <template v-slot:title>
            <i class="fas fa-user-lock"></i>基础信息
          </template>
          <b-row class="mx-2">
            <b-col>
              <div class="text-center">
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
                <div v-if="avatar && saved == false" class="text-center">
                  <b-button class="primary" @click="uploadImage" :loading="saving">保存头像</b-button>
                </div>
              </div>
            </b-col>
            <b-col>
              <b-form @submit="onSubmit" @reset="onReset">
                胜局数:{{account.user.win}}
                败局数:{{account.user.fail}}
                <b-form-group id="input-group-1" label="新的密码:" label-for="input-1">
                  <b-form-input
                    id="input-1"
                    v-model="password"
                    type="password"
                    required
                    placeholder="输入新的密码"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="确认密码:" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="confirm_password"
                    type="password"
                    required
                    placeholder="输入确认密码"
                  ></b-form-input>
                </b-form-group>
                <div class="text-right">
                  <b-button type="submit" variant="primary">修改密码</b-button>
                  <b-button type="reset" variant="danger">重置</b-button>
                </div>
              </b-form>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab>
          <template v-slot:title>
            <i class="fas fa-user"></i>棋盘设置
          </template>
          <b-form-group label="选择棋盘背景色">
            <b-container fluid class="p-4 bg-dark">
              <b-row class="mb-3">
                <b-col>
                  <b-form-radio v-model="background" name="background" value="wood_1024.jpg">
                    <b-img thumbnail fluid src="/static/wood_1024.jpg" alt="Image 1"></b-img>
                  </b-form-radio>
                </b-col>
                <!-- <b-col>
                  <b-form-radio v-model="selected" name="some-radios" value="wood1.jpg">
                    <b-img thumbnail fluid src="/static/wood2.jpg" alt="Image 2"></b-img>
                  </b-form-radio>
                </b-col>-->
                <b-col>
                  <b-form-radio v-model="background" name="background" value="wood3.jpg">
                    <b-img thumbnail fluid src="/static/wood3.jpg" alt="Image 3"></b-img>
                  </b-form-radio>
                </b-col>
                <b-col>
                  <b-form-radio v-model="background" name="background" value="wood4.jpg">
                    <b-img thumbnail fluid src="/static/wood4.jpg" alt="Image 3"></b-img>
                  </b-form-radio>
                </b-col>
                <b-col>
                  <b-form-radio v-model="background" name="background" value="wood5.jpg">
                    <b-img thumbnail fluid src="/static/wood5.jpg" alt="Image 3"></b-img>
                  </b-form-radio>
                </b-col>
                <b-col>
                  <b-form-radio v-model="background" name="background" value="wood6.jpg">
                    <b-img thumbnail fluid src="/static/wood6.jpg" alt="Image 3"></b-img>
                  </b-form-radio>
                </b-col>
                <b-col>
                  <b-form-radio v-model="background" name="background" value="wood7.jpg">
                    <b-img thumbnail fluid src="/static/wood7.jpg" alt="Image 3"></b-img>
                  </b-form-radio>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-button variant="primary" @click="submitBackground">提交</b-button>
                </b-col>
              </b-row>
            </b-container>
          </b-form-group>
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>

<script>
import ImageInput from "../component/ImageInput.vue";
import { userService, gameService } from "../_services";
import { mapState, mapMutations } from "vuex";
export default {
  name: "profile",
  data() {
    return {
      avatar: null,
      saving: false,
      saved: true,
      user: null,
      password: "",
      confirm_password: "",
      background: "",
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.account,
      games: (state) => state.games,
    }),
  },
  components: {
    ImageInput,
  },
  watch: {
    avatar: {
      handler: function () {
        this.saved = false;
        console.log("it changed it ");
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations("alert", ["success", "error", "clear"]),
    ...mapMutations("account", ["changeBackground"]),
    ...mapMutations("games", ["updateNavTitle"]),

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
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.password != this.confirm_password) {
        alert("两次输入的密码不一致！");
        return;
      }
      userService.changePassword(this.password).then((data) => {
        this.success(data.message);
      });
      // alert(JSON.stringify(this.password));
    },
    onReset(evt) {
      this.password = "";
      this.confirm_password = "";
    },
    submitBackground() {
      userService.changeBackground(this.background).then((data) => {
        this.success(data.message);
        this.changeBackground(this.background);
        // alert(this.account.user.background);
      });
    },
  },
  mounted() {
    this.init();
    this.updateNavTitle("个人信息");
    this.background = this.account.user.background;
  },
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
