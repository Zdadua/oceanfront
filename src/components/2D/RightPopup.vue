<script setup>

import YearChart from "./chart/YearChart.vue";
import {useStore} from "vuex";
import {computed, onMounted, ref, watch} from "vue";
import {toLonLat} from "ol/proj";
import {floor} from "mathjs";
import {dateString, fetchWithTimeout, lonLatToDMS} from "../../js/tools.js";
import {DotIterator} from "../../js/map/DotIterator.js";
import EveryYearChart from "./chart/EveryYearChart.vue";

let store = useStore();
let lonPassive = ref();
let lonD = ref();
let lonM = ref();
let lonS = ref();
let latPassive = ref();
let latD = ref();
let latM = ref();
let latS = ref();

let popup = computed(() => store.state['popup'].popup);

let date = computed(() => {
  const year = store.state['mapForTwo'].year;
  const month = store.state['mapForTwo'].month;
  const day = store.state['mapForTwo'].day;

  return new Date(year, month - 1, day);
});

let showDot = computed(() => store.state['popup'].showDot);
watch(showDot, async (newValue) => {

  if(newValue != null) {
    const temp = store.state['mapForTwo'].points.get(newValue);

    let [lon, lat] = toLonLat(temp.getCoordinate());
    setLonLat(lon, lat);
  }

}, {immediate: true})

function setLonLat(lon, lat) {
  const position = lonLatToDMS(lon, lat);

  lonPassive.value = position.lonPassive;
  lonD.value = position.lonD;
  lonM.value = position.lonM;
  lonS.value = position.lonS;
  latPassive.value = position.latPassive;
  latD.value = position.latD;
  latM.value = position.latM;
  latS.value = position.latS;
}

function closeClick() {
  store.commit('popup/dismiss');
}

function leftClick() {
  const iterator = new DotIterator(showDot.value);
  iterator.prev();
}

function rightClick() {
  const iterator = new DotIterator(showDot.value);
  iterator.next();
}

onMounted(() => {
  // fetchData();
})

</script>

<template>

  <Transition name="popup">
    <div v-if="popup" id="popup-wrapper">

      <div id="popup-container">
        <div class="to-left-btn popup-btn" @click="leftClick">
          <img src="../../assets/svg/left.svg" alt="left" width="30" height="30">
        </div>
        <div class="lon-container">
        <span class="big-text">
          {{ lonD }}°
        </span>

          <span class="small-text">
          {{ lonM }}'{{ lonS }}"
        </span>
          <span class="direction">
          {{ lonPassive > 0 ? 'E' : 'W' }}
        </span>
        </div>

        <div class="lat-container">
        <span class="big-text">
        {{ latD }}°
        </span>

          <span class="small-text">
          {{ latM }}'{{ latS }}"
        </span>
          <span class="direction">
          {{ latPassive > 0 ? 'N' : 'S' }}
        </span>
        </div>

        <div class="to-right-btn popup-btn" @click="rightClick">
          <img src="../../assets/svg/right.svg" alt="right" width="30" height="30">
        </div>

        <div class="subtitle" style="grid-column: 2 / 4; grid-row: 3 / 4;">
          海温数据
        </div>

        <div style="grid-column: 2 / 6; grid-row: 4 / 5; border: 1px solid #e1e1e1; border-radius: 5px;">
          <YearChart id="year" :date="date"></YearChart>
        </div>

        <div class="subtitle" style="grid-column: 2 / 4; grid-row: 5 / 6;">
          历年海温
        </div>
        <div style="grid-column: 2 / 6; grid-row: 6 / 7; border: 1px solid #e1e1e1; border-radius: 5px;">
          <EveryYearChart id="everyYear" :date="date"></EveryYearChart>
        </div>

      </div>

      <div id="right-popup-close-btn" @click="closeClick">
        <img src="../../assets/svg/close.svg" alt="close" width="25" height="25">
      </div>

    </div>
  </Transition>

</template>

<style scoped>

#popup-wrapper {
  width: 700px;
  height: 100vh;
  background-color: white;
  border-radius: 20px 0 0 20px;
  position: relative;
  overflow: hidden;

  #popup-container {
    height: 100vh;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: 40px repeat(4, 1fr) 10px;
    grid-template-rows: 50px 80px 50px 250px 50px 250px 40px 50px 250px;
    width: 100%;
    overflow-y: auto;
  }
  #right-popup-close-btn {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 10px;
    left: 10px;

    &:hover {
      cursor: pointer;
      border-radius: 15px;
      background-color: #c5c5c5;
    }
  }
}

.lon-container {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  padding: 15px 0;
}

.lat-container {
  grid-column: 4 / 5;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 15px 0;
}

.big-text, .direction {
  height: 50px;
  line-height: 50px;
  font-size: 2em;
  font-family: UNSII, sans-serif;
  font-weight: 600;
}

.small-text {
  height: 50px;
  line-height: 60px;
  font-size: 1.1em;
  color: #555555;
  font-family: UNSII, sans-serif;
  margin-right: 10px;
}

.popup-btn {
  height: 30px;
  width: 30px;
  align-self: center;
  line-height: 50px;

  &:hover {
    cursor: pointer;
  }

}

.to-left-btn {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  justify-self: right;
}

.to-right-btn {
  grid-column: 5 / 6;
  grid-row: 2 / 3;
  align-self: center;
  justify-self: left;
}

.subtitle {
  font-size: 1.4em;
  color: #575757;
  font-weight: 700;
  font-family: UNSII, sans-serif;
  line-height: 50px;
  text-indent: 30px;
}

.popup-enter-from,
.popup-leave-to {
  transform: translateX(700px);
}

.popup-enter-to,
.popup-leave-from {
  transform: translateX(0px);
}

.popup-enter-active,
.popup-leave-active {
  transition: all .3s ease-in-out;
}

</style>