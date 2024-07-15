<script setup>

import * as d3 from "d3";

import {onMounted, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();
const everyContainer = ref();
let svg;
let w;
let h;

function createNode() {
  svg = d3.create('svg');
  svg.attr('width', w);
  svg.attr('height', h);
}


onMounted(() => {
  w = everyContainer.value.offsetWidth;
  h = everyContainer.value.offsetHeight;

  createNode();
  everyContainer.value.appendChild(svg.node());
})

</script>

<template>

  <div ref="everyContainer" class="every-chart-container">
  </div>

</template>

<style scoped>

.every-chart-container {
  width: 100%;
  height: 100%;
}

</style>