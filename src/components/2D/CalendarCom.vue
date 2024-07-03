<script setup>

import {computed, onMounted, ref} from "vue";
import VirtualScroll from "./VirtualScroll.vue";
import {useStore} from "vuex";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  return [year, month, date];
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

let year = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
let month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

let dropped = ref(false);
const weekday = ['一', '二', '三', '四', '五', '六', '日'];

let store = useStore();
let y = computed(() => store.state['mapForTwo'].year);
let m = computed(() => store.state['mapForTwo'].month);
let d = computed(() => store.state['mapForTwo'].day);
let yearPlace = year.indexOf(y.value.toString())
let monthPlace = month.indexOf(m.value.toString())

let grid = computed(() => {
  let tmpDate = new Date(y.value, m.value - 1, 1);
  let weekday = tmpDate.getDay() - 1;
  let days = getDaysInMonth(y.value, m.value);
  let beforeDays = getDaysInMonth(y.value, m.value - 1);

  let res = [];

  for (let i = weekday - 1; i >= 0; i--) {
    res.push(beforeDays - i);
  }

  for(let i = 1; i <= days; i++) {
    res.push(i);
  }

  for(let i = 1; i <= 35 - days - weekday; i++) {
    res.push(i);
  }

  return res;
})

onMounted(() => {
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
        <div v-for="day in grid" class="day-items">
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
      grid-template-rows: repeat(5, 1fr);

      .day-items {
        height: 100%;
        width: 100%;
        align-self: center;
        font-size: .9em;
        color: black;
        text-align: center;
        line-height: 34px;
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
      }
    }
  }

  .day-chosen {
    background-color: #2a7fff;
  }

}

</style>