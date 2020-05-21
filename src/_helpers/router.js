import Vue from "vue";
import Router from "vue-router";

import HomePage from "../home/HomePage";
import Home from "../home/Home";
import LoginPage from "../login/LoginPage";
import RegisterPage from "../register/RegisterPage";
import PlayPage from "../play/PlayPage";
import KifuPage from "../kifu/KifuPage";
import GamePage from "../game/GamePage";
Vue.use(Router);

export const router = new Router({
  // mode: "history",
  routes: [
    // { path: "/", component: HomePage },
    { path: "/", component: Home },
    { path: "/home", component: HomePage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    { path: "/play/:game_id", component: PlayPage , props: true },
    { path: "/game", component: GamePage },
    { path: "/kifu", component: KifuPage },

    // otherwise redirect to home
    { path: "*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login", "/register", "/play"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = sessionStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next();
});
