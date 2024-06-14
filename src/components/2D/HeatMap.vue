<script setup>

import {int} from "three/nodes";
import {onMounted, ref} from "vue";

let props = defineProps({
  width: {
    required: true,
    type: int,
  },
  height: {
    required: true,
    type: int,
  }
})

let canvas = ref(null)

onMounted(() => {

  let canvasDom = canvas.value;

})

</script>

<template>

  <canvas ref="canvas" id="map"></canvas>

</template>

<style scoped>

</style>