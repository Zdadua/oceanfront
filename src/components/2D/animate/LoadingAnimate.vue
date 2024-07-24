<script setup>

import anime from "animejs/lib/anime.es.js";
import {nextTick, onMounted} from "vue";

function animate() {
  anime({
    targets: '.loading-dot',
    translateY: [
      {value: 15, duration: 100},
      {value: 0, duration: 100},
    ],
    easing: 'easeInCubic',
    autoplay: true,
    loop: true,
    delay: function(el, index, length) {
      return index * 50;
    },
    endDelay: 500
  });
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      animate();
    }, 200);
  })

})

</script>

<template>

  <div class="loading-container">
    <div class="loading-dot" v-for="index in 6" :key="index">
    </div>
    <div class="loading-text">Loading...</div>
  </div>

</template>

<style scoped>

  .loading-container {
    height: 40px;
    width: 120px;
    display: grid;
    grid-template-rows: 40px 30px;
    grid-template-columns: repeat(6, 20px);
  }

  .loading-dot {
    justify-self: center;
    align-self: center;
    height: 10px;
    width: 10px;
    border-radius: 10px;
    background-color: #373737;
    transform: translateY(0);
  }

  .loading-text {
    justify-self: center;
    align-self: center;
    grid-row: 2;
    grid-column: 2 / 6;
    font-size: 1em;
    color: #373737;
    font-family: UNSII, sans-serif;
  }

</style>