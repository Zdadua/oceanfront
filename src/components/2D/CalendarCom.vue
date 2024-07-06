<script setup>

import {computed, nextTick, onMounted, ref} from "vue";
import VirtualScroll from "./VirtualScroll.vue";
import {useStore} from "vuex";

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function clickDay(idx) {
  if(idx >= firstDay.value && idx <= firstDay.value + monthDays.value - 1) {
    store.commit('mapForTwo/day', idx - firstDay.value + 1);
  }
}

let year = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
let month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
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
const weekday = ['一', '二', '三', '四', '五', '六', '日'];

let store = useStore();
let y = computed(() => store.state['mapForTwo'].year);
let m = computed(() => store.state['mapForTwo'].month);
let d = computed(() => store.state['mapForTwo'].day);
let yearPlace = computed(() => year.indexOf(y.value.toString()));
let monthPlace = computed(() => month.indexOf(m.value.toString()));

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

  console.log('before = ' + beforeDays.value + '  weekday = ' + firstDay.value + '  days = ' + monthDays.value)

  return res;
})

onMounted(() => {

  nextTick(() => {
    let tmp = new Date();

    store.commit('mapForTwo/year', tmp.getFullYear());
    store.commit('mapForTwo/month', tmp.getMonth() + 1);
    store.commit('mapForTwo/day', tmp.getDate());
  })
})


</script>

<template>
  <div id="calendar-com-container">
    <div id="calendar-text" @click="dropped = !dropped">{{ y }}年{{ m }}月{{ d }}日</div>
    <div v-if="dropped" id="drop-container">
      <div id="year-month-container">
        <div class="scroll-wrapper">
          <VirtualScroll :name="'year'" :items="year" :sight-width="70" :sight-height="94" :item-height="30" :init-place="yearPlace"></VirtualScroll>
        </div>
        <span class="calendar-span">年</span>
        <div class="scroll-wrapper">
          <VirtualScroll :name="'month'" :items="month" :sight-width="70" :sight-height="94" :item-height="30" :init-place="monthPlace"></VirtualScroll>
        </div>
        <span class="calendar-span">月</span>
      </div>
      <div id="weekday-container">
        <div class="weekday" v-for="day in weekday">{{ day }}</div>
      </div>
      <div id="grid-container">
        <div v-for="(day, index) in grid" class="day-items" @click="clickDay(index)">
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

  #calendar-text {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
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
    border: 1px solid #1c2d2e;

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
        height: 94px;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        color: black;
        text-align: center;
        line-height: 34px;
        user-select: none;
        background-color: white;

        &:hover {
          background-color: #d8d8d8;
        }

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

  .day-chosen {
    background-color: #2a7fff;
  }

}

</style>