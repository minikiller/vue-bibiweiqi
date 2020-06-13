import MyVideo from "./MyVideo.vue";

const install = function (Vue, opts = {}) {
  if (install.installed) return;
  Vue.component(MyVideo.name, MyVideo);
};

module.exports = {
  MyVideo,
  install
};

module.exports.default = module.exports;
