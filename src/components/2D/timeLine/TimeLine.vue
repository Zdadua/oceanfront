<script setup>

import {computed, onMounted} from "vue";
import {PlayController} from "../../../js/map/PlayController.js";
import {useStore} from "vuex";
import {isLeapYear} from "../../../js/tools.js";

const store = useStore();
let controller;

let offset = computed(() => {
  let year = store.state['mapForTwo'].year;
  if(isLeapYear(year)) {
    return 680 / 366;
  }
  return 680 / 365;
})

function playClick() {
  if(controller == null) {
    controller = new PlayController(store.state['mapForTwo'].map);
  }
  controller.play();
}

</script>

<template>

  <div id="time-line-container">
    <div id="play-btn-wrapper" class="btn-wrapper" @click="playClick">
      <img src="../../../assets/svg/play.svg" alt="play" width="10" height="10">
    </div>

    <div id="line-wrapper">
      <div id="main-line">

      </div>
      <div id="cursor">
        <div id="triangle">
        </div>
      </div>
    </div>

    <div id="change-unit-wrapper" class="btn-wrapper" @click="">
      <img src="../../../assets/svg/changeUnit.svg" alt="changeUnit" width="30" height="30">
    </div>
  </div>

</template>

<style scoped>

  #time-line-container {
    height: 50px;
    width: 800px;
    background-color: white;
    border-radius: 25px;
    box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);
    box-sizing: border-box;

    position: relative;

    display: grid;
    grid-template-columns: 50px 1fr 50px;
  }

  .btn-wrapper {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #0072ff;
    display: flex;
    align-items: center;
    justify-content: center;

    place-self: center;
  }

  #line-wrapper {
    width: calc(100% - 20px);
    margin: 0 10px;
    height: 100%;

    position: relative;
  }

  #cursor {
    width: 2px;
    height: 30px;
    position: absolute;
    background-color: #0072ff;

    #triangle {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 10px solid blue;

      position: absolute;
      bottom: -2px;
      left: -4px;
    }
  }

  #main-line {
    border-radius: 5px;
    height: 3px;
    width: 100%;
    background-color: black;
    top: 20px;
    position: absolute;
  }

</style>