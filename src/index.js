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