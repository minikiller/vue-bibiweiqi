<template>
  <div>
    <span v-show="show" @click="getCode">获取验证码</span>
    <span v-show="!show" class="count">时间: 00:00:{{ count }} s</span>
    <span v-show="!show" class="count">读秒: 30秒 {{ numbers }}次</span>
  </div>
</template>

<script>
// 读秒组件效果演示
export default {
  name: "timer",
  data() {
    return {
      show: true,
      count: "",
      timer: null,
      numbers: 1,
    };
  },
  methods: {
    getCode() {
      const TIME_COUNT = 30;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
            if (this.count == 0 && this.numbers > 0) {
              this.numbers--;
              this.count = TIME_COUNT;
            }
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
            alert("you failed");
          }
        }, 1000);
      }
    },
  },
};
</script>
