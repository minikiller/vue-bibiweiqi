<template>
  <div>
    <my-go total_time="1000" blackOne="sunlf111" whiteOne="mini111" blackTwo="sdsd111" whiteTwo="sunlf12311" />
   <b-list-group>
      <b-list-group-item href="http://apple.com">iPhone</b-list-group-item>
       <b-list-group-item>OnePlus 3T</b-list-group-item>
      <b-list-group-item>Samsung Galaxy 8</b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import MyGo from "../component/MyGo";
export default {
  components: {
    MyGo
  }
};
</script>