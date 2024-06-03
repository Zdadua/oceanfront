<script setup>

  import * as d3 from 'd3'
  import {onMounted} from "vue";
  import * as topojson from "topojson-client";
  import { CanvasOrth } from '../assets/js/orthographic/cnvsOrth.js'
  import { SvgOrth } from '../assets/js/orthographic/svgOrth.js'

  onMounted(()=>{

    const topology = fetch('./src/assets/ocean.json').then(res => res.json())
      .then(data => {
        const options = {
          id: 'map',
          r: 500,
          geoList: {
            ocean: data,
          }
        }

        const orthographic = new SvgOrth(options);
        orthographic.paint();

    })

  })


</script>

<template>

<!--  <div id="test-graphic"></div>-->
  <div id="map"></div>

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