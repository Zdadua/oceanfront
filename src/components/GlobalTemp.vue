<script setup>

import {onMounted} from "vue";
import {SvgOrthographic} from '../assets/js/orthographic/svgOrth.js';
import { HeatMap } from "../assets/js/orthographic/heatMap.js";

onMounted(()=>{

  const options = {
    svgId: 'projection',
    size: 1000,
    point: [0, 0]
  }

  const orthographic = new SvgOrthographic(options);
  orthographic.init();

  const context = document.getElementById('canvas-map').getContext('2d')
  const heatMap = new HeatMap(context, './src/assets/wuhu.csv');
  heatMap.init();

  })


</script>

<template>

  <div id="map">
    <svg id="projection" width="1000" height="1000"></svg>
  </div>
  <div id="heat-map">
    <canvas id="canvas-map" width="1440" height="1440"></canvas>
  </div>

</template>

<style lang="less" scoped>

  #heat-map {
    width: 1440px;
    height: 1440px;
  }

  #map {
    width: 1000px;
    height: 1000px;
  }


</style>