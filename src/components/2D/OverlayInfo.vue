<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import {toLonLat} from "ol/proj";
import OverlayChart from "./chart/OverlayChart.vue";
import {easeOut} from "ol/easing.js";

let store = useStore();

const props = defineProps({
  coordinate: {
    type: Object,
    required: true
  },
  id: {
    type: Number,
    required: true
  },

});

let hided = ref(false);
let temp = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

function hideOverlay() {
  hided.value = true;
}

function removeOverlay() {
  store.commit('mapForTwo/remove', props.id);
}

function showOverlay() {
  hided.value = false;
}

function popup() {

  store.commit('popup/popup', props.id);
  const view = store.state['mapForTwo'].map.getView();
  const map = store.state['mapForTwo'].map;

  let width = document.getElementById('map-container').offsetWidth;
  let height = document.getElementById('map-container').offsetHeight;
  let pixel = map.getPixelFromCoordinate(props.coordinate);
  let deltaY = height / 2 - pixel[1];

  pixel[0] = pixel[0] + width / 5;
  pixel[1] = pixel[1] + deltaY;

  let co = map.getCoordinateFromPixel(pixel);

  view.animate({
    center: co,
    rotation: 0,
    duration: 800,
    easing: easeOut

  })
}

let [lon, lat] = toLonLat(props.coordinate);
let lonLat = computed(() => {
  let absLon = Math.abs(lon); // 取绝对值以便计算
  let lonD = Math.floor(absLon); // 度
  let lonM = Math.floor((absLon - lonD) * 60); // 分
  lonM = lonM < 10 ? '0' + lonM : lonM;
  let lonS = Math.floor((absLon - lonD - lonM / 60) * 3600); // 秒
  lonS = lonS < 10 ? '0' + lonS : lonS;

  let absLat = Math.abs(lat); // 取绝对值以便计算
  let latD = Math.floor(absLat); // 度
  let latM = Math.floor((absLat - latD) * 60); // 分
  latM = latM < 10 ? '0' + latM : latM;
  let latS = Math.floor((absLat - latD - latM / 60) * 3600); // 秒
  latS = latS < 10 ? '0' + latS : latS;

  return [lonD, lonM, lonS, latD, latM, latS];
})

onMounted(() => {
    if(props.coordinate) {

    }
})

</script>

<template>
  <div class="overlay-info-container">
    <div v-if="!hided" class="visible-container">
      <div class="info-text">
        <span class="degree">{{ lonLat[0] + '°'}}</span>
        <span class="min-sec">{{ lonLat[1] + '\'' + lonLat[2] + '"'}}</span>
        <span class="unit">{{ lon < 0 ? 'W' : 'E' }}</span>
        <span class="degree" style="margin-left: 20px" >{{ lonLat[3] + '°'}}</span>
        <span class="min-sec">{{ lonLat[4] + '\'' + lonLat[5] + '"'}}</span>
        <span class="unit">{{ lat < 0 ? 'S' : 'N' }}</span>
      </div>

      <div class="minimize-btn" @click="hideOverlay">
        <img src="../../assets/svg/minimize.svg" alt="minimize" width="15" height="15">
      </div>
      <div class="close-btn" @click="removeOverlay">
        <img src="../../assets/svg/close.svg" alt="close" width="15" height="15">
      </div>

      <div class="chart-wrapper">
        <OverlayChart :width="290" :height="230" :data="temp" :title="'temperature for 15 days'"></OverlayChart>
      </div>

      <div class="more-btn" @click="popup">
        Learn more
      </div>

    </div>

    <div v-if="hided" @click="showOverlay" style="left: -5px; top: -5px; position: absolute; width: 10px; height: 10px;"></div>

  </div>

</template>

<style scoped>

.overlay-info-container {
  position: relative;
}

.visible-container {
  box-sizing: border-box;
  padding: 5px 5px;
  width: 300px;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  position: absolute;
  top: -50px;
  left: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);

  .info-text {
    position: absolute;
    top: 10px;
    width: 100%;
    height: 30px;
    font-family: UNSII Serif sans-serif;
    margin-bottom: 10px;

    .degree {
      line-height: 30px;
      font-size: 1.1em;
      font-weight: 900;
      color: black;
    }

    .min-sec {
      margin-left: 5px;
      line-height: 20px;
      font-size: .7em;
      font-weight: 500;
      color: gray;
    }

    .unit {
      margin-left: 3px;
      line-height: 30px;
      font-size: 1.2em;
      font-weight: 900;
      color: #4e4e4e;
    }

  }

  .chart-wrapper {
    width: 100%;
    height: 230px;
  }

  .more-btn {
    margin-top: 5px;
    width: 100px;
    height: 25px;
    border-radius: 30px;
    line-height: 22px;
    text-align: center;
    font-family: UNSII Serif sans-serif;
    background-color: black;
    font-weight: 500;
    font-size: .8em;
    color: white;
    border: solid 1px black;
    box-sizing: border-box;

    transition: background-color .2s ease-in-out, color .2s ease-in-out;

    &:hover {
      cursor: pointer;
      background-color: white;
      color: black;

      border: solid 1px #7a898e;
    }
  }

  .close-btn {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    right: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  .minimize-btn {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    right: 35px;

    &:hover {
      cursor: pointer;
    }
  }

  &:after {
    content: '';

    width: 10px;
    height: 5px;
    border-radius: 5px 0 0 5px;

    position: absolute;
    left: -15px;
    top: 44px;
    border-style: solid;
    border-width: 4px;
    border-color: white;
  }
}
</style>