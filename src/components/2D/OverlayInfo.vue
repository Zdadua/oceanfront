<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref, watch} from "vue";
import {toLonLat} from "ol/proj";
import OverlayChart from "./chart/OverlayChart.vue";
import {easeOut} from "ol/easing.js";
import {abs, floor} from "mathjs";
import { lonLatToDMS } from "../../js/tools.js";

let store = useStore();

let props = defineProps({
  coordinate: {
    type: Object,
    required: true
  },
  id: {
    type: Number,
    required: true
  },

});

let overlay = computed(() => store.state['mapForTwo'].points.get(props.id));

let hided = ref(false);
let xDomain = computed(() => {
  const year = store.state['mapForTwo'].year;
  const month = store.state['mapForTwo'].month;
  const day = store.state['mapForTwo'].day;

  let startDay = new Date(year, month - 1, day);
  startDay.setDate(startDay.getDate() - 7);

  let endDay = new Date(year, month - 1, day);
  endDay.setDate(endDay.getDate() + 7);

  return [startDay, endDay];
})

let data = ref([]);

function hideOverlay() {
  hided.value = !hided.value;
}

function removeOverlay() {
  store.commit('mapForTwo/remove', props.id);
}

function pinToTop() {

}

let briefContainer = ref();
function mouseDown(e) {
  const map = store.state['mapForTwo'].map;
  let startX = e.clientX;
  let startY = e.clientY;
  let startPixel = map.getPixelFromCoordinate(overlay.value.getPosition());
  let finalPixel = map.getPixelFromCoordinate(overlay.value.getPosition());
  let mouseMove = function(event) {

    let endX = event.clientX;
    let endY = event.clientY;

    finalPixel[0] = startPixel[0] + (endX - startX);
    finalPixel[1] = startPixel[1] + (endY - startY);

    let co = map.getCoordinateFromPixel(finalPixel);

    overlay.value.getOverlay().setPosition(co);
    overlay.value.updateLine(co);

  };

  let mouseUp = function(event) {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
    overlay.value.setPosition(map.getCoordinateFromPixel(finalPixel));
  }

  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
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
  return lonLatToDMS(lon, lat);
})

onMounted(() => {

})

</script>

<template>
  <div class="overlay-info-container">
    <div class="visible-container">
      <div ref="briefContainer" class="brief-container" @mousedown="mouseDown">
        <div class="info-text">
          <span class="degree">{{ lonLat.lonD + '°'}}</span>
          <span class="min-sec">{{ lonLat.lonM + '\'' + lonLat.lonS + '"'}}</span>
          <span class="unit">{{ lonLat.lonPassive < 0 ? 'W' : 'E' }}</span>
          <span class="degree" style="margin-left: 20px" >{{ lonLat.latD + '°'}}</span>
          <span class="min-sec">{{ lonLat.latM + '\'' + lonLat.latS + '"'}}</span>
          <span class="unit">{{ lonLat.latPassive < 0 ? 'S' : 'N' }}</span>
        </div>

        <div class="minimize-btn" @click="hideOverlay">
          <img :class="{'dismiss': hided}" src="../../assets/svg/up.svg" alt="minimize" width="15" height="15">
        </div>
        <div class="close-btn" @click="removeOverlay">
          <img src="../../assets/svg/close.svg" alt="close" width="15" height="15">
        </div>
      </div>

      <div v-show="!hided" class="more-info-container">
        <div class="chart-wrapper">
          <OverlayChart :coordinate="props.coordinate" :id="id" :data="data" :title="'前后7天海表温度'"></OverlayChart>
        </div>

        <div class="more-btn" @click="popup">
          了解更多
        </div>
      </div>



    </div>

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
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: absolute;
  top: -25px;

  background-color: white;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);

  .brief-container {
    height: 40px;
    width: 100%;

    .close-btn {
      width: 10px;
      height: 10px;
      position: absolute;
      top: 15px;
      right: 10px;

      &:hover {
        cursor: pointer;
      }
    }

    .minimize-btn {
      width: 10px;
      height: 10px;
      position: absolute;
      top: 15px;
      right: 35px;

      img {
        transition: all .2s ease-in-out;
      }

      &:hover {
        cursor: pointer;
      }
    }

    .dismiss {
      transform: rotate(180deg);
    }

  }

  .info-text {
    user-select: none;
    position: absolute;
    top: 10px;
    width: 100%;
    height: 30px;
    font-family: UNSII Serif sans-serif;

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
}

.sticky {
  z-index: 100;
}

</style>