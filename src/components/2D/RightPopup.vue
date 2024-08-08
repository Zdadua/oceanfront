<script setup>

// TODO 在切换节点时，表格有抖动的情况

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

let information = ref();

let showDot = computed(() => store.state['popup'].showDot);
let coordinate = computed(() => store.state['mapForTwo'].points.get(showDot.value));

watch([showDot, coordinate], async (newValue) => {

  if(newValue[0] != null && newValue[1] != null) {
    const temp = store.state['mapForTwo'].points.get(newValue[0]);

    let [lon, lat] = toLonLat(temp.getCoordinate());
    setLonLat(lon, lat);

    const url = `/data/sst_mean/${floor(lat)}/${floor(lon)}`;
    const infoUrl = `/data/information/${floor(lat)}/${floor(lon)}`;
    fetchWithTimeout({url: url, timeout: 10000})
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          if(error.message === 'timeout') {
            console.log('network request timout!');
          }
          else if(error.message === 'Network response was not ok') {
            console.log('Network response was not ok!');
          }
          else {
            console.error('An error occurred at OverlayChart.vue:', error);
          }
        });

    fetchWithTimeout({url: infoUrl, timeout: 10000})
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response wat not ok');
          }
          return response.json();
        })
        .then(data => {
          information.value = data['鱼类'];
        })
        .catch(error => {
          if(error.message === 'timeout') {
            console.log('network request timout!');
          }
          else if(error.message === 'Network response was not ok') {
            console.log('Network response was not ok!');
          }
          else {
            console.error('An error occurred at OverlayChart.vue:', error);
          }
        });
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

        <div  class="subtitle" style="grid-column: 2 / 4; grid-row: 7 / 8;">
          鱼类资源
        </div>

        <div style="grid-column: 2 / 6; grid-row: 8/ 9; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div class="marine-info-box" v-for="(obj, index) in information" :key="index">
            <span class="marine-info-text" style="padding-left: 15px; grid-column: 1 / 3;">
              <span style="color: #2c2c2c; font-weight: 900;">名称:</span>
              <span style="margin-left: 15px; font-weight: 300">{{ obj['名称'] }}</span>
            </span>
            <span class="marine-info-text" style="padding-left: 15px; grid-row: 2 / 3; grid-column: 1 / 2;">
              <span style="color: #2c2c2c; font-weight: 900;">生活深度:</span>
              <span style="margin-left: 15px; font-weight: 300; font-family: 'Microsoft Himalaya', sans-serif;">{{ obj['生活深度'] }}</span>
            </span>
            <span class="marine-info-text" style="padding-left: 15px; grid-row: 2 / 3; grid-column: 2 / 3;">
              <span style="color: #2c2c2c; font-weight: 900;">生活范围:</span>
              <span style="margin-left: 15px; font-weight: 300">{{ obj['生活范围'] }}</span>
            </span>
            <span class="marine-info-text" style="padding-left: 15px; grid-row: 3 / 4; grid-column: 1 / 2;">
              <span style="color: #2c2c2c; font-weight: 900;">适宜生活海温:</span>
              <span style="margin-left: 15px; font-weight: 300; font-size: 1.3em; font-family: 'Microsoft Himalaya', sans-serif;">{{ obj['适宜生活的海温'] }}</span>
            </span>
            <span class="marine-info-text" style="padding-left: 15px; grid-row: 3 / 4; grid-column: 2 / 3;">
              <span style="color: #2c2c2c; font-weight: 900;">重点打捞时间地点:</span>
              <span style="margin-left: 15px; font-weight: 300">{{ obj['重点打捞时间地点'] }}</span>
            </span>

            <span class="marine-info-text" style="padding-left: 15px; grid-row: 4 / 5; grid-column: 1 / 3;">
              <span style="color: #2c2c2c; font-weight: 900;">集中出现月份:</span>
              <span style="margin-left: 15px; font-weight: 300">{{ obj['集中出现月份'] }}</span>
            </span>
          </div>
        </div>

      </div>

      <div id="right-popup-close-btn" @click="closeClick">
        <img src="../../assets/svg/close.svg" alt="close" width="25" height="25">
      </div>

    </div>
  </Transition>

</template>

<style scoped>

.marine-info-box {
  height: 130px;
  box-sizing: border-box;
  margin: 7px 5px;
  padding: 5px 0;
  border: 1px solid rgb(255, 98, 0);
  border-radius: 5px;

  display: grid;
  grid-template-columns: 1fr 400px;
  grid-template-rows: 30px repeat(3, 30px);
}

.marine-info-text {
  color: #2c2c2c;
  font-size: 1em;
  font-family: Marlett, sans-serif;
  align-self: center;
}

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
    grid-template-rows: 50px 80px 50px 250px 50px 250px 50px;
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