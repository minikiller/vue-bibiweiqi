<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col sm="6">
        <b-card>
          <div>
            <div class="logo">
              <img src="/static/img/logo.png" width="240" />
            </div>
            <div>
              <form @submit.prevent="handleSubmit">
                <div class="form-group">
                  <input
                    type="text"
                    v-model="username"
                    name="username"
                    placeholder="用户名"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !username }"
                  />
                  <div v-show="submitted && !username" class="invalid-feedback">
                    Username is required
                  </div>
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    v-model="password"
                    name="password"
                    placeholder="密码"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !password }"
                  />
                  <div v-show="submitted && !password" class="invalid-feedback">
                    Password is required
                  </div>
                </div>
                <div class="form-group">
                  <!--<b-button block variant="success" :disabled="status.loggingIn">登录</b-button>-->
                  <b-button
                    type="submit"
                    block
                    variant="success"
                    :disabled="status.loggingIn"
                    >登录</b-button
                  >
                </div>
                <div>
                  <router-link to="/register" class="btn btn-link"
                    >注册</router-link
                  >
                </div>
              </form>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { BButton } from "bootstrap-vue";

export default {
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
    };
  },
  computed: {
    ...mapState("account", ["status"]),
  },
  created() {
    // reset login status
    this.logout();
  },
  methods: {
    ...mapActions("account", ["login", "logout"]),
    handleSubmit(e) {
      this.submitted = true;
      const { username, password } = this;
      if (username && password) {
        this.login({ username, password });
      }
    },
  },
};
</script>

<style scoped>
.logo {
  margin-bottom: 1rem;
  vertical-align: middle;
  text-align: center;
}</style
>>
