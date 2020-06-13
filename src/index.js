import config from "config";
import { store } from "./_store";
import { router } from "./_helpers";
import App from "./app/App";
import Notifications from "vue-notification";

/* import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSignOutAlt,faUserSecret } from "@fortawesome/free-solid-svg-icons";
library.add(faSignOutAlt);
library.add(faUserSecret); */

// import { IconsPlugin } from "bootstrap-vue";

// This imports all the layout components such as <b-container>, <b-row>, <b-col>:
// import { LayoutPlugin } from "bootstrap-vue";
// Vue.use(LayoutPlugin);

// This imports <b-modal> as well as the v-b-modal directive as a plugin:
// import { ModalPlugin } from "bootstrap-vue";
// Vue.use(ModalPlugin);

// This imports <b-card> along with all the <b-card-*> sub-components as a plugin:
// import { CardPlugin } from "bootstrap-vue";
// Vue.use(CardPlugin);

// This imports directive v-b-scrollspy as a plugin:
// import { VBScrollspyPlugin } from "bootstrap-vue";
// Vue.use(VBScrollspyPlugin);

// This imports the dropdown and table plugins
// import { DropdownPlugin, TablePlugin } from "bootstrap-vue";
// Vue.use(DropdownPlugin);
// Vue.use(TablePlugin);
// Vue.use(IconsPlugin);

// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue/dist/bootstrap-vue.css"  ;
const Vue = require("vue");
// Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(Notifications);
import "vue-select/dist/vue-select.css";

import vSelect from "vue-select";
Vue.component("v-select", vSelect);

import { vueBaberrage } from 'vue-baberrage' //弹幕
Vue.use(vueBaberrage)

const VueSocketIO = require("vue-socket.io");
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: `${config.socketUrl}`,
    vuex: {
      store,
      actionPrefix: "SOCKET_", //为vuex设置的两个前缀
      mutationPrefix: "SOCKET_",
    },
    // options: { autoConnect: false }, //Optional options
  })
);

/* import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify, {
  theme: {
    secondary: "#0e71a3",
    primary: "#52c2b8",
    accent: "#e95e29",
  },
}); */

// Vue.use(VeeValidate);
// import VeeValidate from "vee-validate";
const VeeValidate = require("vee-validate");
Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: "veeFields",
});

require("./wgo/wgo.js");
require("./wgo/kifu.js");
require("./wgo/sgfparser.js");
require("./wgo/player.js");
require("./wgo/basicplayer.js");
require("./wgo/basicplayer.component.js");
// require("./wgo/basicplayer.infobox.js");
require("./wgo/basicplayer.control.js");
require("./wgo/player.marker.js");
require("!./wgo/i18n.zh.js");
require("./wgo/scoremode.js");

// setup fake backend
// import { configureFakeBackend } from './_helpers';
// configureFakeBackend();
export const EventBus = new Vue();
export const format = require("string-format");
format.extend(String.prototype, {});

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
