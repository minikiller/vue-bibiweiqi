import Vue from "vue";

import Home from "../home/Home";
import LoginPage from "../login/LoginPage";
import RegisterPage from "../register/RegisterPage";
import PlayPage from "../play/PlayPage";
import KifuPage from "../kifu/KifuPage";
import GamePage from "../game/GamePage";
import FriendPage from "../friend/FriendPage";
import ProfilePage from "../profile/ProfilePage";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const Router = require("vue-router");

if (process.env.NODE_ENV === "development") {
  Vue.use(Router);
}

export const router = new Router({
  mode: "history",
  routes: [
    // { path: "/", component: Hello },
    { path: "/", component: Home },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    { path: "/play/:game_id", component: PlayPage, props: true },
    { path: "/game", component: GamePage },
    { path: "/kifu", component: KifuPage },
    { path: "/profile", component: ProfilePage },
    { path: "/friend", component: FriendPage },

    // otherwise redirect to home
    { path: "*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = sessionStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  } else {
    NProgress.start();
    next();
  }

  // next();
});

// router.beforeEach((to, from, next) => {
//   if (to.path == "/login") {
//     sessionStorage.removeItem("username");
//   }
//   let user = sessionStorage.getItem("username");
//   if (!user && to.path != "/login") {
//     next({ path: "/login" });
//   } else {
//     NProgress.start();
//     next();
//   }
// });

router.afterEach((transition) => {
  NProgress.done();
});
