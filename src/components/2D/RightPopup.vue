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
      <div class="to-left-btn popup-btn">
        <img src="../../assets/svg/left.svg" alt="left" width="30" height="30">
      </div>
      <div class="lon-container">
        <span class="big-text">
          45°
        </span>

        <span class="small-text">
          12'45"
        </span>
        <span class="direction">
          E
        </span>
      </div>

      <div class="lat-container">
          <span class="big-text">

          </span>

        <span class="small-text">

          </span>
        <span class="direction">

          </span>
      </div>
      <div class="to-right-btn popup-btn">
        <img src="../../assets/svg/right.svg" alt="right" width="30" height="30">
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

.lon-container {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  padding: 15px 0;
}

.lat-container {
  grid-column: 4 / 5;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 15px 0;
}

.big-text, .direction {
  height: 50px;
  line-height: 50px;
  font-size: 2em;
  font-family: UNSII, sans-serif;
  font-weight: 600;
}

.small-text {
  height: 50px;
  line-height: 60px;
  font-size: 1.1em;
  color: #555555;
  font-family: UNSII, sans-serif;
  margin-right: 10px;
}

.popup-btn {
  height: 30px;
  width: 30px;
  align-self: center;
  line-height: 50px;
}

.to-left-btn {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  justify-self: right;
}

.to-right-btn {
  grid-column: 5 / 6;
  grid-row: 2 / 3;
  align-self: center;
  justify-self: left;
}

</style>