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

onMounted(() => {

})


</script>

<template>
  <div id="calendar-com-container">
<!--    <div id="drop-container">-->
<!--      <div id="year-month-container">-->
<!--        <div class="scroll-wrapper">-->
<!--          <ScrollPicker :items="['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']"></ScrollPicker>-->
<!--        </div>-->
<!--        <span class="calendar-span">年</span>-->
<!--        <div class="scroll-wrapper">-->
<!--        </div>-->
<!--        <span class="calendar-span">月</span>-->
<!--      </div>-->
<!--      <div id="grid-container">-->

<!--      </div>-->
<!--    </div>-->

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
      height: 144px;
      border-bottom: 1px solid #c8c8c8;
      display: flex;
      box-sizing: border-box;
      padding: 5px 0 5px 30px;

      .calendar-span {
        margin: 50px 0;
        height: 34px;
        line-height: 34px;
      }

      .scroll-wrapper {
        width: 70px;
        height: 134px;

        display: flex;
        flex-direction: column;
        justify-content: center;
      }

    }

    #grid-container {
      box-sizing: border-box;
      padding: 2px;
      width: 100%;
      height: 205px;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(5, 1fr);
    }

  }

}

</style>