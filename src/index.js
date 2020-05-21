import Vue from 'vue';
import VeeValidate from 'vee-validate';

import { store } from './_store';
import { router } from './_helpers';
import App from './app/App';

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-select/dist/vue-select.css';

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
Vue.use(BootstrapVue)
Vue.use(VeeValidate);

require('exports-loader?WGo!./wgo/wgo.js');
require('exports-loader?WGo.KifuReader,WGo.Kifu!./wgo/kifu.js');
require('exports-loader?WGo.SGF!./wgo/sgfparser.js');
require('exports-loader?WGo.Player!./wgo/player.js');
require('exports-loader?WGo.BasicPlayer!./wgo/basicplayer.js');
require('exports-loader?WGo.BasicPlayer.component!./wgo/basicplayer.component.js');
require('exports-loader?WGo.BasicPlayer.component.InfoBox!./wgo/basicplayer.infobox.js');
require('exports-loader?WGo.i18n["zh"]!./wgo/i18n.zh.js');
require('exports-loader?WGo.ScoreMode!./wgo/scoremode.js');
// setup fake backend
// import { configureFakeBackend } from './_helpers';
// configureFakeBackend();
export const EventBus = new Vue();
export const format = require('string-format')
format.extend (String.prototype, {})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});