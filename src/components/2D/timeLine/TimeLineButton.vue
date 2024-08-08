<script setup>

import {PlayController} from "../../../js/map/PlayController.js";
import {useStore} from "vuex";
import {fromLonLat} from "ol/proj.js";
import {easeOut} from "ol/easing.js";

const store = useStore();
let controller;

function playClick() {
  if(controller == null) {
    controller = new PlayController(store.state['mapForTwo'].map);
  }
  controller.playTest();
}

function changeUnit() {
  store.commit('mapForTwo/changeUnit');

  let view = store.state['mapForTwo'].map.getView();
  view.animate({
    center: fromLonLat([-117, 43]),
    zoom: 4,
    rotation: 0,
    duration: 600,
    easing: easeOut
  });

}

</script>

<template>

  <div id="time-line-container">
    <div id="play-btn-wrapper" class="btn-wrapper" @click="playClick">
      <img src="../../../assets/svg/play.svg" alt="play" width="10" height="10">
    </div>
    <div id="change-unit-wrapper" class="btn-wrapper" style="margin-right: 15px;" @click="changeUnit">
      <img src="../../../assets/svg/changeUnit.svg" alt="changeUnit" width="30" height="30">
    </div>
  </div>

</template>

<style scoped>

  .cursors {
    position: absolute;
    width: 2px;
    height: 10px;
    bottom: 20px;
    background-color: black;
  }

  .numbers {
    width: 10px;
    position: absolute;
    bottom: 4px;
    color: black;
    font-size: .7em;
    display: grid;

    & > span {
      place-self: center;
      user-select: none;
    }
  }

  #time-line-container {
    user-select: none;
    height: 50px;
    width: 90px;
    background-color: white;
    border-radius: 25px;
    box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);
    box-sizing: border-box;

    position: relative;

    display: grid;
    grid-template-columns: 50px 50px;
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

    &:hover {
      cursor: pointer;
    }
  }

  #cursor {
    width: 10px;
    height: 30px;
    position: absolute;
    transition: left .2s ease-in-out;

    display: grid;

    #cursor-line {
      width: 2px;
      height: 30px;
      justify-self: center;
      background-color: #0072ff;
    }

    #triangle {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 10px solid blue;

      position: absolute;
      bottom: 0;
    }

    #cursor-date {
      width: 50px;
      height: 20px;
      border-radius: 10px;
      background-color: #0072ff;
      display: grid;

      position: absolute;
      top: -25px;
      left: -25px;

      & > span {
        place-self: center;
        color: white;
        font-size: .8em;
      }
    }

  }

  #main-line {
    border-radius: 5px;
    height: 3px;
    width: 100%;
    background-color: #606060;
    top: 20px;
    position: absolute;
  }

</style>