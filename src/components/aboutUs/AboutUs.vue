<script setup>

import TextCube from "./TextCube.vue";
import ThreeEarth from "./ThreeEarth.vue";
import PicLib from "./PicLib.vue";

</script>

<template>
  <div id="about-us-container">
    <div id="three-earth-container" class="sec-container">
      <ThreeEarth />
    </div>
    <div id="info-container" class="sec-container">
      <div id="grid-container">
        <TextCube class="first" background-image="./src/assets/svg/card01.svg" />
        <TextCube class="second" background-image="none" />
        <TextCube class="third" background-image="none" />
        <TextCube class="fourth" background-image="none" />
      </div>
    </div>

    <div id="pic-container" class="sec-container">
      <PicLib />
    </div>

  </div>
</template>

<style scoped lang="less">

#about-us-container {
  width: 100vw;
  height: 100vh;
}

.sec-container {
  width: 100%;
  box-sizing: border-box;
}

#info-container{

  background-image: radial-gradient(100% 100% at 50% 0%, #000000 45%, #1e1e1e 100%);
  margin-bottom: 50px;

  #grid-container {
    margin: 0 auto;
    display: grid;
    grid-template-columns: 300px 300px 300px;
    grid-template-rows: 150px 150px 150px;
    grid-gap: 20px 20px;
    justify-content: center;

    .first {
      grid-column: 1/3;
      grid-row: 1/3;
      background-size: cover;
    }

    .second{
      grid-column: 3/4;
      grid-row: 1/3;
      background-size: cover;
    }

    .third {
      grid-column: 1/2;
      grid-row: 3/4;
      background-size: cover;
    }

    .fourth {
      grid-column: 2/4;
      grid-row: 3/4;
      background-size: cover;
    }
  }
}

#three-earth-container {
  height: 850px;
  background-color: black;
}

#pic-container {
  height: 400px;
  background-image: radial-gradient(100% 100% at 50% 0%, #1e1e1e 90%, #22402c 100%);
}

</style>