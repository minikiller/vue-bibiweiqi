<template>
  <div id="app">
    <Navbar />
    <HelloWorld />
  </div>
</template>
<script>
import HelloWorld from "../component/HelloWorld.vue";
import Navbar from "../component/NavBar.vue";
export default {
  name: "navbar",
  components: {
    Navbar,
    HelloWorld,
  },
};
</script>
