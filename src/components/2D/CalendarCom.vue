<script setup>

import {computed, nextTick, onMounted, ref} from "vue";
import VirtualScroll from "./VirtualScroll.vue";
import {useStore} from "vuex";

let store = useStore();

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

let chosenIndex = ref(0);
let chosenY = ref(0);
let chosenM = ref(0);
let isRightMY = computed(() => {

  return chosenY.value == y.value && chosenM.value == m.value;
})
function clickDay(idx) {

  if(idx >= firstDay.value && idx <= firstDay.value + monthDays.value - 1) {
    store.commit('mapForTwo/day', idx - firstDay.value + 1);

    chosenIndex.value = idx;
    chosenY.value = y.value;
    chosenM.value = m.value;
  }
}

let year = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
let month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const weekday = ['一', '二', '三', '四', '五', '六', '日'];

let firstDay = computed(() => {
  let tmp = new Date(y.value, m.value - 1, 1);
  return !tmp.getDay() ? 6 : tmp.getDay() - 1;
})
let monthDays = computed(() => {
  return getDaysInMonth(y.value, m.value);
})
let beforeDays = computed(() => {
  return getDaysInMonth(y.value, m.value - 1);
})

let dropped = ref(false);

let y = computed(() => store.state['mapForTwo'].tmpYear);
let showY = computed(() => store.state['mapForTwo'].year);
let m = computed(() => store.state['mapForTwo'].tmpMonth);
let showM = computed(() => store.state['mapForTwo'].month);
let d = computed(() => store.state['mapForTwo'].day);
let yearPlace = computed(() => year.indexOf(showY.value.toString()));
let monthPlace = computed(() => month.indexOf(showM.value.toString()));

let grid = computed(() => {

  let res = [];

  for (let i = firstDay.value - 1; i >= 0; i--) {
    res.push(beforeDays.value - i);
  }

  for(let i = 1; i <= monthDays.value; i++) {
    res.push(i);
  }

  for(let i = 1; i <= 42 - monthDays.value - firstDay.value; i++) {
    res.push(i);
  }

  return res;
})

onMounted(() => {
  let tmp = new Date();
  tmp.setDate(tmp.getDate() - 1);
  store.commit('mapForTwo/year', tmp.getFullYear());
  store.commit('mapForTwo/tmpYear', tmp.getFullYear());
  store.commit('mapForTwo/month', tmp.getMonth() + 1);
  store.commit('mapForTwo/tmpMonth', tmp.getMonth() + 1);
  store.commit('mapForTwo/day', tmp.getDate());

  chosenIndex.value = firstDay.value + d.value - 1;
  chosenY.value = showY.value;
  chosenM.value = showM.value;

})


</script>

<template>
  <div id="calendar-com-container">
    <div id="calendar-text" @click="dropped = !dropped">{{ showY }}年{{ showM }}月{{ d }}日</div>
    <div v-if="dropped" id="drop-container">
      <div id="year-month-container">
        <div class="scroll-wrapper">
          <VirtualScroll :name="'tmpYear'" :items="year" :sight-width="70" :sight-height="94" :item-height="30" :init-place="yearPlace"></VirtualScroll>
          <div class="top-line"></div>
          <div class="bottom-line"></div>
        </div>
        <span class="calendar-span">年</span>
        <div class="scroll-wrapper">
          <VirtualScroll :name="'tmpMonth'" :items="month" :sight-width="70" :sight-height="90" :item-height="30" :init-place="monthPlace"></VirtualScroll>
          <div class="top-line"></div>
          <div class="bottom-line"></div>
        </div>
        <span class="calendar-span">月</span>
      </div>
      <div id="weekday-container">
        <div class="weekday" v-for="day in weekday">{{ day }}</div>
      </div>
      <div id="grid-container">
        <div v-for="(day, index) in grid" class="day-items" @click="clickDay(index)" :class="[(index < firstDay || index >= firstDay + monthDays) ? 'cant-choose' : 'can-choose', (index === chosenIndex && isRightMY) ? 'day-chosen': '']">
          {{ day }}
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

#calendar-com-container {
  width: 250px;
  height: 50px;
  background-color: #f0f0f0;
  border-radius: 25px;
  z-index: 99;
  position: relative;
  box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);

  #calendar-text {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    
    &:hover {
      cursor: pointer;
    }

  }

  #drop-container {
    position: absolute;
    width: 250px;
    height: 350px;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: white;
    box-shadow: 2px 2px 8px rgba(55, 55, 55, 0.2);
    top: -355px;

    #year-month-container {
      width: 100%;
      height: 94px;
      display: flex;
      box-sizing: border-box;
      padding: 5px 0 5px 30px;

      .calendar-span {
        margin: 30px 0;
        height: 34px;
        line-height: 34px;
        color: #2a7fff;
        font-weight: 800;
      }

      .scroll-wrapper {
        width: 70px;
        height: 90px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;

        .top-line {
          position: absolute;
          height: 1px;
          width: 80%;
          background-color: #939393;
          top: 30px;
          left: calc(10%);
        }

        .bottom-line {
          position: absolute;
          height: 1px;
          width: 80%;
          background-color: #939393;
          bottom: 30px;
          left: calc(10%);
        }

      }

    }

    #grid-container {
      box-sizing: border-box;
      padding: 6px;
      width: 100%;
      height: 205px;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(6, 1fr);

      .day-items {
        height: 100%;
        width: 100%;
        align-self: center;
        font-size: .9em;
        text-align: center;
        line-height: 34px;
        user-select: none;
      }

      .cant-choose {
        background-color: #e3e3e3;
        color: #636363;
      }

      .can-choose {
        color: black;
        &:hover {
          background-color: #d8d8d8;
          cursor: pointer;
        }
      }

      .day-chosen {
        background-color: #2a7fff;
        color: white;
      }

    }

    #weekday-container {
      margin-top: 10px;
      display: grid;
      width: 100%;
      height: 20px;
      grid-template-columns: repeat(7, 1fr);

      .weekday {
        font-size: .9em;
        align-self: center;
        text-align: center;
        color: #2a7fff;
      }
    }
  }

}

</style>