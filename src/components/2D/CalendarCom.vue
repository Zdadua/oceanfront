<script setup>

import {onMounted, ref} from "vue";
import ScrollPicker from "./ScrollPicker.vue";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  return [year, month, date];
}

function calculateResistance(y) {
  let maxResistance = 0.1; // 最大阻力
  return 1 - (y / window.innerHeight) * maxResistance;
}

let yearPicker = ref(null);
let dropped = ref(false);
const weekday = ['一', '二', '三', '四', '五', '六', '日'];

onMounted(() => {

})


</script>

<template>
  <div id="calendar-com-container">
    <div id="calendar-text" @click="dropped = !dropped">日期</div>
    <div v-if="dropped" id="drop-container">
      <div id="year-month-container">
        <div class="scroll-wrapper">
          <ScrollPicker :items="['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']"></ScrollPicker>
        </div>
        <span class="calendar-span">年</span>
        <div class="scroll-wrapper">
          <ScrollPicker :items="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']"></ScrollPicker>
        </div>
        <span class="calendar-span">月</span>
      </div>
      <div id="weekday-container">
        <div class="weekday" v-for="day in weekday">{{ day }}</div>
      </div>
      <div id="grid-container">

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
        mask: linear-gradient(rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 0) 90%);
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

}

</style>