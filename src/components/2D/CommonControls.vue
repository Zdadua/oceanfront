<script setup>

import {useStore} from "vuex";
import {fromLonLat} from "ol/proj";
import {easeOut} from "ol/easing.js";

let store = useStore();

function returnClick() {
  let view = store.state['mapForTwo'].map.getView();
  view.animate({
    center: fromLonLat([160, 25]),
    duration: 800,
    easing: easeOut
  })
}

function zoomIn() {
  let view = store.state['mapForTwo'].map.getView();
  view.animate({
    zoom: view.getZoom() + 1,
    duration: 500,
    easing: easeOut
  })
}

function zoomOut() {
  let view = store.state['mapForTwo'].map.getView();
  view.animate({
    zoom: view.getZoom() - 1,
    duration: 500,
    easing: easeOut
  })
}

</script>

<template>

  <div id="common-container">
    <div id="zoom-in" class="common-controls" @click="zoomIn">
      +
    </div>
    <div id="zoom-out" class="common-controls" @click="zoomOut">
      -
    </div>
    <div id="return" @click="returnClick">
      <img id="return-svg" alt="search" src="../../assets/svg/return.svg" width="20" height="20">
    </div>

  </div>

</template>

<style scoped>

#common-container {
  width: 50px;
  display: flex;
  flex-direction: column;
}

.common-controls {
  margin-bottom: 10px;
  width: 30px;
  height: 30px;
  background-color: black;
  border-radius: 15px;
  color: white;
  text-align: center;
  line-height: 30px;
  font-weight: 900;
  transition: color .3s ease-in-out, background-color .3s ease-in-out;

  &:hover {
    color: black;
    background-color: white;
    cursor: pointer;
  }
}

#return {
  width: 30px;
  height: 30px;
  background-color: black;
  border-radius: 15px;
  color: white;
  transition: color .3s ease-in-out, background-color .3s ease-in-out;
  user-select: none;
  cursor: pointer;
  font-weight: 800;
  font-size: .9em;

  #return-svg {
    transform: translate(5px, 5px);
  }

}

</style>