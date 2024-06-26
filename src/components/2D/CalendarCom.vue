<script setup>

import {onMounted} from "vue";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  return [year, month, date];
}

onMounted(() => {

})


</script>

<template>
  <div id="calendar-com-container">

    <div id="drop-container">
      <div id="year-month-container">
        <ul>

        </ul>
        <span>年</span>

        <ul>

        </ul>
        <span>月</span>
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

  #drop-container {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: white;

    top: -255px;

    #year-month-container {
      width: 100%;
      height: 45px;
      border-bottom: 1px solid #c8c8c8;
      display: flex;
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