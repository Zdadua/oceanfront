<script setup>

import {onMounted, ref} from "vue";
import {SvgOrthographic} from '../assets/js/orthographic/svgOrth.js';
import { HeatMap } from "../assets/js/orthographic/heatMap.js";

const tmpCanvas = ref(null);

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
  heatMap.init().then(image => {

    // 获取tmpCanvas的2d上下文
    const tmpCtx = tmpCanvas.value.getContext('2d');
    // 将image绘制到tmpCanvas上
    tmpCtx.putImageData(image, 0, 0);

    let a = document.createElement('a');
    a.href = document.getElementById('tmp-canvas').toDataURL('image/jpg');
    a.download = 'canvas.jpg';
    a.textContent = 'download';
    document.getElementById('tmp').appendChild(a);

  })

})

</script>

<template>

  <div id="map">
    <svg id="projection" width="1000" height="1000"></svg>
  </div>
  <div id="heat-map">
    <canvas ref="" id="canvas-map" width="2880" height="1440"></canvas>
  </div>

  <div id="tmp">
    <canvas ref="tmpCanvas" id="tmp-canvas" width="2880" height="1440"></canvas>
  </div>

</template>

<style lang="less" scoped>

  #heat-map {
    width: 2880px;
    height: 2880px;
  }

  #map {
    width: 1000px;
    height: 1000px;
  }

  #tmp-canvas {
    width: 1440px;
    height: 720px;
  }


</style>