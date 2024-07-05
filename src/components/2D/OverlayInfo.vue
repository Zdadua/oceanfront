<script setup>

import {useStore} from "vuex";
import {onMounted, ref} from "vue";

let over = ref();
const store = useStore();

onMounted(() => {
  over.value.addEventListener('click', (event) => {
    console.log(123);
  })
})

</script>

<template>
  <div ref="over" class="overlay-info-container">
    <div class="info-text">Current Position:</div>
    <div class="lon-lat"></div>

    <div class="minimize-btn">
      <img src="../../assets/svg/minimize.svg" alt="minimize" width="15" height="15">
    </div>
    <div class="close-btn">
      <img src="../../assets/svg/close.svg" alt="close" width="15" height="15">
    </div>

  </div>

</template>

<style scoped>

.overlay-info-container {
  box-sizing: border-box;
  padding: 5px;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  left: -50px;
  background-color: white;
  border-radius: 10px;

  .info-text {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 1em;
    margin-bottom: 10px;
  }

  .lon-lat {
    max-width: 190px;
    height: 30px;
    align-content: center;
    line-height: 30px;
    font-size: .8em;
    background-color: #e4e4e4;
  }

  .close-btn {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    right: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  .minimize-btn {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    right: 35px;

    &:hover {
      cursor: pointer;
    }
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 40px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #ffffff transparent transparent transparent;
  }
}

</style>