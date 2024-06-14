<script setup>

import {onMounted, ref} from "vue";

onMounted(() => {

})

</script>

<template>

  <div id="two-d-map-container" class="see-sight">
<!--  绘制热力图作为底图  -->
    <div id="heat-map-container">
      <canvas id="heat-map"></canvas>
    </div>
<!--  绘制经纬度和轮廓线  -->
    <div id="grid-container">
      <svg id="grid"></svg>
    </div>
<!--  粒子效果待定  -->
  </div>

</template>

<style scoped>

  .see-sight {
    width: 100vw;
    height: 100vh;
  }

  #two-d-map-container {
    position: relative;
  }

  #heat-map-container {
    position: absolute;
  }

  #grid-container {
    position: absolute;
  }

</style>