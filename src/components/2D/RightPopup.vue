<script setup>

import {useStore} from "vuex";

let store = useStore();

function closeClick() {
  store.commit('mapForTwo/dismiss');
}

</script>

<template>

  <div id="popup-wrapper">

    <div id="popup-container">
      <div id="popup-lon-lat-container">
        <div class="big-text">

        </div>

        <div class="small-text">

        </div>

      </div>
    </div>

    <div id="right-popup-close-btn" @click="closeClick">
      <img src="../../assets/svg/close.svg" alt="close" width="25" height="25">
    </div>

  </div>

</template>

<style scoped>

#popup-wrapper {
  width: 700px;
  height: 100vh;
  background-color: white;
  border-radius: 20px 0 0 20px;
  position: relative;
  overflow: hidden;

  #popup-container {
    display: grid;
    grid-gap: 5px;
    grid-template-columns: 10px repeat(4, 1fr) 10px;
    grid-template-rows: 50px 80px repeat(4, 300px);
    width: 100%;
    overflow-y: auto;
  }
  #right-popup-close-btn {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 15px;
    left: 15px;

    &:hover {
      cursor: pointer;
      border-radius: 15px;
      background-color: #c5c5c5;
    }
  }
}

#popup-lon-lat-container {
  grid-column: 3 / 5;
  grid-row: 2 / 3;
}

</style>