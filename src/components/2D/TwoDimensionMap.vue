<script setup>

import {onMounted, ref} from "vue";
import { LineDrawer } from "../../js/map/lineDrawer.js";

let grid = ref(null)

onMounted(() => {
  let drawer = new LineDrawer(grid.value);
  drawer.init();
})

</script>

<template>

  <div id="two-d-map-container" class="see-sight">
<!--  绘制热力图作为底图  -->
    <div id="heat-map-container">
      <canvas id="heat-map"></canvas>
    </div>
<!--  绘制经纬度和轮廓线  -->
    <div ref="grid" id="grid-container">
    </div>
<!--  粒子效果待定  -->
  </div>

</template>

<style scoped>

  .see-sight {
    width: 100vw;
    height: 100vh;
    background-color: white;
  }

  #two-d-map-container {
    position: relative;
  }

  #heat-map-container {
    position: absolute;
  }

  #grid-container {
    width: 100%;
    height: 100%;
    position: absolute;
  }

</style>