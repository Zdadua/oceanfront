<script setup>

  import * as d3 from 'd3'
  import {onMounted} from "vue";
  import { generateChart } from "../assets/js/testArea.js";
  import { generateOrthographic, rotate } from "../assets/js/testArea.js";
  import * as topojson from "topojson-client";

  onMounted(()=>{

    // let container = document.getElementById('test-graphic')
    // generateChart().then(snode => {
    //   container.appendChild(snode);
    // })
    let canvas = document.getElementById("map-canvas");
    let context = canvas.getContext("2d");
    const topology = fetch('./src/assets/hello.json').then(res => {
      const topology = res.json();
      console.log(topology);
      // const coast = topojson.feature(topology, topology.objects.coastline_50m);

      const rotateGenerator = rotate(context);
      let result = rotateGenerator.next();

      function rotateAnimate() {
        if(!result.done) {
          result = rotateGenerator.next();
        }

        requestAnimationFrame(rotateAnimate);
      }

      rotateAnimate();
    })

  })


</script>

<template>

<!--  <div id="test-graphic"></div>-->
  <canvas id="map-canvas" width="1000" height="1000"></canvas>

</template>

<style lang="less" scoped>

  #test-graphic {
    width: 100%;
    height: 100%;
  }

  #map-canvas {
    width: 1000px;
    height: 1000px;
  }


</style>