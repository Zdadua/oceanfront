<script setup>

import TextCube from "./TextCube.vue";

</script>

<template>
  <div id="about-us-container">
    <div id="three-earth-container">

    </div>
    <div id="info-container">
      <div id="grid-container">
        <TextCube class="first" />
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">

#about-us-container {
  width: 100vw;
  height: 100vh;
}

#info-container {
  width: 100%;
  box-sizing: border-box;

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
    }
  }

}

</style>