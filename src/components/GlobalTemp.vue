<script setup>

import {onMounted} from "vue";
import {SvgOrthographic} from '../assets/js/orthographic/svgOrth.js';
import { fetchData } from "../assets/js/fetchData.js";

onMounted(()=>{
  const url = {
    ocean: './src/assets/ocean.json',
    heatMap: './src/assets/wuhu.csv',
  }

  const options = {
    svgId: 'projection',
    size: 1000,
    point: [0, 0]
  }

  const orthographic = new SvgOrthographic(options);
  orthographic.init();

  })


</script>

<template>

<!--  <div id="test-graphic"></div>-->
  <div id="map">
    <svg id="projection" width="1000" height="1000"></svg>
  </div>

</template>

<style lang="less" scoped>

  #test-graphic {
    width: 100%;
    height: 100%;
  }

  #map {
    width: 1000px;
    height: 1000px;
  }


</style>