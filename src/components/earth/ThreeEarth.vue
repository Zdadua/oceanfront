<script setup>

import { createEarth, animate } from "../../assets/js/THREE/ThreeEarth.js";
import {onMounted} from "vue";

onMounted(() => {
  let earth = createEarth();

  document.getElementById("earth-container").appendChild(earth);
  animate();
})

</script>

<template>

  <div id="earth-container">

  </div>

</template>

<style scoped>

</style>