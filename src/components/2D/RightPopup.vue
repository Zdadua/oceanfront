<script setup>

import SeasonChart from "./chart/SeasonChart.vue";
import {useStore} from "vuex";
import {onMounted, ref} from "vue";

let store = useStore();
let testData = ref([])
let summerData = ref([])
let fallData = ref([])
let winterData = ref([])

function closeClick() {
  store.commit('mapForTwo/dismiss');
}

async function fetchData() {
  const response = await fetch('/data/sst/12/12');
  const text = await response.text();

  let origin = text.split(',').map((d) => parseFloat(d));
  console.log(origin);

  const startOfYear = new Date(2024, 0, 1);
  const endOfYear = new Date(2024, 11, 31);
  const startOfSpring = new Date(2024, 2, 21);
  const startOfSummer = new Date(2024, 5, 21);
  const startOfFall = new Date(2024, 8, 21);
  const startOfWinter = new Date(2024, 11, 21);

  let l = Math.floor((endOfYear - startOfYear) / (24 * 60 * 60 * 1000));
  for(let i = origin.length; i <= l; i++) {
    origin.push(NaN);
  }

  testData.value = origin.slice(Math.floor((startOfSpring - startOfYear) / (24 * 60 * 60 * 1000)), Math.floor((startOfSummer - startOfYear) / (24 * 60 * 60 * 1000)));
  summerData.value = origin.slice(Math.floor((startOfSummer - startOfYear) / (24 * 60 * 60 * 1000)), Math.floor((startOfFall - startOfYear) / (24 * 60 * 60 * 1000)));
  fallData.value = origin.slice(Math.floor((startOfFall - startOfYear) / (24 * 60 * 60 * 1000)), Math.floor((startOfWinter - startOfYear) / (24 * 60 * 60 * 1000)));

  let tmp = origin.slice(Math.floor((startOfWinter - startOfYear) / (24 * 60 * 60 * 1000)), origin.length);
  winterData.value = tmp.concat(origin.slice(0, Math.floor((startOfSpring - startOfYear) / (24 * 60 * 60 * 1000))));
}

onMounted(() => {
  fetchData();
})

</script>

<template>

  <div id="popup-wrapper">

    <div id="popup-container">
      <div class="to-left-btn popup-btn">
        <img src="../../assets/svg/left.svg" alt="left" width="30" height="30">
      </div>
      <div class="lon-container">
        <span class="big-text">
          45°
        </span>

        <span class="small-text">
          12'45"
        </span>
        <span class="direction">
          E
        </span>
      </div>

      <div class="lat-container">
        <span class="big-text">
        45°
        </span>

        <span class="small-text">
          12'45"
        </span>
        <span class="direction">
          N
        </span>
      </div>

      <div class="to-right-btn popup-btn">
        <img src="../../assets/svg/right.svg" alt="right" width="30" height="30">
      </div>

      <div class="subtitle" style="grid-column: 2 / 4; grid-row: 3 / 4;">
        四季海温分析
      </div>

      <div style="grid-column: 2 / 6; grid-row: 4 / 5; border: 1px solid #e1e1e1; border-radius: 5px;">
        <SeasonChart title="Spring" :data="testData"></SeasonChart>
      </div>
      <div style="grid-column: 2 / 6; grid-row: 5 / 6; border: 1px solid #e1e1e1; border-radius: 5px;">
        <SeasonChart title="Summer" :data="summerData"></SeasonChart>
      </div>
      <div style="grid-column: 2 / 6; grid-row: 6 / 7; border: 1px solid #e1e1e1; border-radius: 5px;">
        <SeasonChart title="Fall" :data="fallData"></SeasonChart>
      </div>
      <div style="grid-column: 2 / 6; grid-row: 7 / 8; border: 1px solid #e1e1e1; border-radius: 5px;">
        <SeasonChart title="Winter" :data="winterData"></SeasonChart>
      </div>

      <div class="subtitle" style="grid-column: 2 / 4; grid-row: 9 / 10;">
        历年海温
      </div>
      <div style="grid-column: 2 / 6; grid-row: 10 / 11; border: 1px solid #e1e1e1; border-radius: 5px;">
        <SeasonChart title="" :data="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]"></SeasonChart>
      </div>

    </div>

    <div id="right-popup-close-btn" @click="closeClick">
      <img src="../../assets/svg/close.svg" alt="close" width="25" height="25">
    </div>

  </div>

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
    grid-template-rows: 50px 80px 50px repeat(4, 250px) 40px 50px 250px;
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

</style>