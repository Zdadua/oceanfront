<script setup>

import * as d3 from 'd3';
import {scaleLinear} from "d3";

const props = defineProps({
  width: {
    type: Number,
    default: 500,
  },
  height: {
    type: Number,
    default: 500,
  }
})

function paintChart() {
  let width = props.width;
  let height = props.height;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const x = scaleLinear(

  )

}

</script>

<template>

  <div>

  </div>

</template>

<style scoped>

</style>