<template> </template>>

<script>
import config from "config";
import { authHeader, handleResponse } from "../_helpers";
import { userService } from "../_services";
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      account: (state) => state.account,
    }),
  },
  data() {
    return {
      name: "我的棋谱",
    };
  },
  mounted() {},
};
</script>
