<template>
  <b-container fluid>
    <b-row>
      <b-col class="col-8">
        <b-avatar v-if="offline" variant="info" :src="offline_avatar"></b-avatar>
        <b-avatar v-else variant="info" :src="avatar"></b-avatar>

        <b-img :src="imgSrc" fluid alt="Responsive image" width="20px"></b-img>
        {{ name }}
        <br />
        [{{ rank}}]
        <br />
      </b-col>
      <b-col>
        <b-row>
          <b-col>用时：{{ format_playTime }}</b-col>
        </b-row>
        <b-row>
          <b-col>提子：{{ caps }}</b-col>
          <!-- <b-card-text>提子：</b-card-text> -->
        </b-row>
        <b-row>
          <b-col>读秒:</b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mx-2">
      <b-col cols="4">
        <div v-if="prepared">
          <i class="far fa-check-circle"></i>
        </div>
        <div v-else>
          <i class="far fa-times-circle"></i>
        </div>
      </b-col>
      <b-col>
        <div v-if="turn">
          <b-img src="/static/img/xingqi.png" fluid alt="Responsive image" width="59px"></b-img>
        </div>
        <div v-if="win">
          <b-img src="/static/img/huosheng.png" fluid alt="Responsive image" width="59px"></b-img>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "info",
  data() {
    return {
      offline_avatar: "/static/img/offline.jpg"
    };
  },
  props: {
    avatar: String,
    name: String,
    rank: String,
    caps: String,
    playtime: String,
    turn: Boolean,
    imgSrc: String,
    win: Boolean,
    offline: Boolean,
    prepared: Boolean
  },
  computed: {
    format_playTime: function() {
      let time = this.playtime;
      var min = Math.floor(time / 60);
      var sec = Math.round(time) % 60;
      var str = min + ":" + (sec < 10 ? "0" + sec : sec) + "";
      return str;
    }
  }
};
</script>