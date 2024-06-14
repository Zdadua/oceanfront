<script setup>

import {onMounted, ref} from "vue";
import {SvgOrthographic} from '../assets/js/orthographic/svgOrth.js';
import { HeatMap } from "../assets/js/orthographic/heatMap.js";

const tmpCanvas = ref(null);
const time = ref(null);

function getDateHeatMap() {
  const context = document.getElementById('canvas-map').getContext('2d');
  context.clearRect(0, 0, 5000, 5000);
  let time = document.getElementById('timeDate').value;
  console.log(time)
  const heatMap = new HeatMap(context, time.toString());
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
}

onMounted(()=>{


  const options = {
    svgId: 'projection',
    size: 1000,
    point: [0, 0],
  }

  const orthographic = new SvgOrthographic(options);
  orthographic.init();

  let date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(1);
  date.setUTCFullYear(2023);
  // const heatMap = new HeatMap(context, '2024-01-01');
  // heatMap.init().then(image => {
  //
  //   // 获取tmpCanvas的2d上下文
  //   const tmpCtx = tmpCanvas.value.getContext('2d');
  //   // 将image绘制到tmpCanvas上
  //   tmpCtx.putImageData(image, 0, 0);
  //
  //   let a = document.createElement('a');
  //   a.href = document.getElementById('tmp-canvas').toDataURL('image/jpg');
  //   a.download = 'canvas.jpg';
  //   a.textContent = 'download';
  //   document.getElementById('tmp').appendChild(a);
  //
  // })

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
    <canvas ref="tmpCanvas" id="tmp-canvas" width="4320" height="2160"></canvas>
  </div>

  <input type="date" id="timeDate" />
  <button @click="getDateHeatMap" >draw HeatMap</button>

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
    width: 4320px;
    height: 2160px;
  }


</style>