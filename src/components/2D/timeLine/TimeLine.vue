<script setup>

import {onMounted} from "vue";
import {PlayController} from "../../../js/map/PlayController.js";
import {useStore} from "vuex";

const store = useStore();
let controller;

function playClick() {
  if(controller == null) {
    controller = new PlayController(store.state['mapForTwo'].map);
  }
  controller.play();
}

</script>

<template>

  <div id="time-line-container">
    <div id="play-btn-wrapper" @click="playClick">
      <img src="../../../assets/svg/play.svg" alt="play" width="10" height="10">
    </div>
  </div>

</template>

<style scoped>

  #time-line-container {
    height: 50px;
    width: 400px;
    background-color: white;
    border-radius: 25px;
    box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);
    box-sizing: border-box;
    padding: 10px 10px;
  }

  #play-btn-wrapper {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #0072ff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>