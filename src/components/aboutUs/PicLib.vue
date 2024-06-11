<script setup>

import {onMounted, ref} from "vue";

const urls = []

const picContainer = ref(null);
let item = {};

for(let i = 0; i < 50; i++) {
  item[i] = i;
}

onMounted(() => {
  const length = urls.length;



})

</script>

<template>

  <div ref="picContainer" id="pic-lib-container">
    <div v-for="text in item" class="picture">
      {{ text }}
    </div>
  </div>

</template>

<style scoped>

#pic-lib-container {
  width: 600px;
  height: 400px;
  margin: 0 auto;
  position: relative;
  transition: 0.5s;

  &:nth-child(1) {
    width: 600px;
    height: 400px;
    transform: translate3d(-650px, 0, -50px);
    background-color: white;
    opacity: .5;
  }

  &:nth-child(2) {
    width: 600px;
    height: 400px;
    transform: translate3d(0, 0, 0);
    background-color: white;
    opacity: 1;
  }

  &:nth-child(3) {
    width: 600px;
    height: 400px;
    transform: translate3d(650px, 0, -50px);
    background-color: white;
    opacity: .5;
  }

}

.picture {
  position: absolute;
  width: 600px;
  height: 400px;
  background-color: white;
  opacity: 0;
}

</style>