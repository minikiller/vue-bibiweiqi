import { userService } from "../_services";
import { router } from "../_helpers";

const user = JSON.parse(sessionStorage.getItem("user"));
//生成随机用户名
var user_name =
  "user" +
  Math.random()
    .toString()
    .substr(2, 5);
//匿名用户
const temp_user = {
  name: user_name,
  isadmin: false,
};
const state = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: temp_user };

const actions = {
  login({ dispatch, commit }, { username, password }) {
    commit("loginRequest", { username });

    userService.login(username, password).then(
      (user) => {
        commit("loginSuccess", user);
        router.push("/");
      },
      (error) => {
        commit("loginFailure", error);
        dispatch("alert/error", error, { root: true });
      }
    );
  },
  logout({ commit }) {
    userService.logout();
    commit("logout");
  },
  register({ dispatch, commit }, user) {
    commit("registerRequest", user);

    userService.register(user).then(
      (user) => {
        commit("registerSuccess", user);
        router.push("/login");
        setTimeout(() => {
          // display success message after route change completes
          dispatch("alert/success", "Registration successful", { root: true });
        });
      },
      (error) => {
        commit("registerFailure", error);
        dispatch("alert/error", error, { root: true });
      }
    );
  },
};

const mutations = {
  loginRequest(state, user) {
    state.status = { loggingIn: true };
    state.user = user;
  },
  loginSuccess(state, user) {
    state.status = { loggedIn: true };
    state.user = user;
  },
  loginFailure(state) {
    state.status = {};
    state.user = null;
  },
  logout(state) {
    state.status = {};
    state.user = null;
  },
  registerRequest(state, user) {
    state.status = { registering: true };
  },
  registerSuccess(state, user) {
    state.status = {};
  },
  registerFailure(state, error) {
    state.status = {};
  },
  changeBackground(state, value) {
    state.user.background = value;
    sessionStorage.setItem("user", JSON.stringify(state.user));
  },
};

export const account = {
  namespaced: true,
  state,
  actions,
  mutations,
};
