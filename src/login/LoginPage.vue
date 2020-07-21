<template>
  <b-row align-h="center">
    <b-col sm="6">
      <b-card>
        <div>
          <div class="logo">
            <img src="/static/img/logo.png" width="240" />
          </div>
          <div>
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <b-icon icon="person-fill"></b-icon>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    v-model="username"
                    name="username"
                    placeholder="用户"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !username }"
                  />
                </b-input-group>
                <div v-show="submitted && !username" class="invalid-feedback">请输入登陆用户名</div>
              </div>
              <div class="form-group">
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <b-icon icon="lock-fill"></b-icon>
                  </b-input-group-prepend>
                  <b-form-input
                    type="password"
                    v-model="password"
                    name="password"
                    placeholder="密码"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !password }"
                  />
                </b-input-group>
                <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
              </div>
              <b-form-checkbox v-model="remember" name="checkbox-1" switch>记住密码</b-form-checkbox>
              <div class="form-group">
                <!--<b-button block variant="success" :disabled="status.loggingIn">登录</b-button>-->
                <b-button type="submit" block variant="success" :disabled="loggingIn">
                  <b-spinner small v-if="loggingIn"></b-spinner>登录
                </b-button>
              </div>
              <div>
                <router-link to="/register" class="btn btn-link">
                  <b-button variant="outline-info" class="mb-2">
                    <b-icon icon="person-plus-fill"></b-icon>&nbsp注册
                  </b-button>
                </router-link>

                <!-- <b-button variant="outline-info" class="mb-2" @click="test">
                  <b-icon icon="person-plus-fill"></b-icon>test
                </b-button>-->
              </div>
            </form>
          </div>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
const Base64 = require("js-base64").Base64;

export default {
   
  data() {
    return {
      username: "",
      password: "",
      remember: false,
      submitted: false,
      loggingIn: false
    };
  },
  computed: {
    ...mapState("account", ["status"])
  },
  created() {
    // reset login status
    // 在页面加载时从cookie获取登录信息
    let account = this.getCookie("account");
    let password = Base64.decode(this.getCookie("password"));
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.username = account;
      this.password = password;
      this.remember = true;
    }
    this.logout();
  },
  methods: {
    ...mapActions("account", ["login", "logout"]),
    handleSubmit(e) {
      this.submitted = true;
      const { username, password } = this;
      if (username && password) {
        this.login({ username, password });
        this.loggingIn = true;
        this.setUserInfo();
      }
    },
    test() {
      if ("vibrate" in window.navigator) {
        // window.navigator.vibrate(100); 震动
        window.navigator.vibrate([200, 100, 200]); // 震动200停100再震动200，和qq的消息震动一样
      } else {
        console.log("浏览器不支持震动");
      }
    },
    // 储存表单信息
    setUserInfo: function() {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.remember) {
        this.setCookie("account", this.username);
        // base64加密密码
        let passWord = Base64.encode(this.password);
        this.setCookie("password", passWord);
      } else {
        this.setCookie("account", "");
        this.setCookie("password", "");
      }
    },
    // 获取cookie
    getCookie: function(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 保存cookie
    setCookie: function(cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    }
  }
};
</script>

<style scoped>
.logo {
  margin-bottom: 1rem;
  vertical-align: middle;
  text-align: center;
}
.col-sm-6 {
  margin: 15px;
}
</style>

