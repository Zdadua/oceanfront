<script setup>

import { init } from '../../js/aboutUs/initIcon.js'
import {computed, onMounted} from "vue";
import {compute} from "three/nodes";
import anime from "animejs/lib/anime.es.js";

let cubes = init().flat();

cubes = cubes.map((num) => {
  if(num == 1) return 'blue';
  if(num == 0) return 'green';
  if(num == -1) return 'nothing';
  if(num == 2) return 'deep-blue';
  if(num == 3) return 'deep-green';
  if(num == 4) return 'shallow-blue';
  if(num == 5) return 'shallow-green';
  if(num == 6) return 'orange';
})

onMounted(() => {
  anime({
    targets: '#grid-container .small-cube',
    scale: [
      {value: .5, easing: 'easeOutSine', duration: 500},
      {value: 1, easing: 'easeInOutQuad', duration: 1200},
      {value: 1, duration: 3000}
    ],
    delay: anime.stagger(20, {grid: [21, 56], from: 'center'}),
    loop: true,
  })
})

</script>

<template>

  <div>
    <RouterLink id="grid-container" to="/twoMap">
      <div class="small-cube" v-for="cube in cubes" :class="[cube]" ></div>
    </RouterLink>
  </div>

</template>

<style scoped>

  #grid-container {
    display: grid;
    width: 1169px;
    margin-top: 200px;
    height: 500px;
    grid-template-columns: repeat(56, 14px);
    grid-template-rows: repeat(21, 14px);
    grid-gap: 7px;
  }

  .small-cube {
    width: 14px;
    height: 14px;
  }

  .blue {
    background-color: #2a7fffff;
  }

  .green {
    background-color: #00ff00ff;
  }

  .deep-green {
    background-color: #008000ff;
  }

  .shallow-green {
    background-color: #00aa00ff;
  }

  .nothing {
    opacity: 0;
  }

  .deep-blue {
    background-color: #0044aaff;
  }

  .shallow-blue {
    background-color: #0055d4ff;
  }

  .orange {
    background-color: #e36001;
  }

</style>