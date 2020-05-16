<template>
  <div id="app">
    <Navbar />
    <Card />
  </div>
</template>
<script>
import Card from "../component/Card.vue";
import Navbar from "../component/NavBar.vue";
export default {
  name: "navbar",
  components: {
    Navbar,
    Card,
  },
};
</script>
