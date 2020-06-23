import Vue from "vue";

import Home from "../home/Home";
import LoginPage from "../login/LoginPage";
import RegisterPage from "../register/RegisterPage";
import PlayPage from "../play/PlayPage";
import KifuPage from "../kifu/KifuPage";
import KifuViewPage from "../kifu/KifuViewPage";
import GamePage from "../game/GamePage";
import FriendPage from "../friend/FriendPage";
import ProfilePage from "../profile/ProfilePage";
import Timer from "../component/timer";
import NotFound from '../component/404.vue';
import Page from '../component/Page.vue';
import NProgress from "nprogress";

import AllArticle from "../article/all-article";
import CreateArticle from "../article/create-article";
import EditArticle from "../article/edit-article";
import DeleteArticle from "../article/delete-article";

import "nprogress/nprogress.css";

const Router = require("vue-router");

if (process.env.NODE_ENV === "development") {
  Vue.use(Router);
}

export const router = new Router({
  mode: "history",
  // base: '/dist',
  routes: [
    // { path: "/", component: Hello },
    { path: "/", component: Home },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    {
      path: "/play",
      name: "PlayPage",
      component: PlayPage,
      props: true,
    },
    { path: "/game", component: GamePage },
    { path: "/kifu", component: KifuPage },
    { path: "/kifu-view", name: "KifuView", component: KifuViewPage },
    { path: "/profile", component: ProfilePage },
    { path: "/friend", component: FriendPage },
    { path: "/page", component: Page },
    { path: "/timer", component: Timer },
    {
      path: "/all-article",
      name: "AllArticle",
      component: AllArticle,
    },
    {
      path: "/create-article",
      name: "CreateArticle",
      component: CreateArticle,
    },
    {
      path: "/edit-article",
      name: "EditArticle",
      component: EditArticle,
    },
    {
      path: "/delete-article",
      name: "DeleteArticle",
      component: DeleteArticle,
    },
    { path: '*', component: NotFound }
    // otherwise redirect to home
    // { path: "*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login", "/register", "/play", "/kifu"];
  var authRequired = !publicPages.includes(to.path);
  // if (to.path.indexOf("play") > -1) authRequired = false;
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
