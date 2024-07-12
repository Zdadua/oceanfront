<script setup>

import {computed, ref} from "vue";

const temp = computed(() => {
  return isCelsius.value ? tempC : tempF;
}) ;

let tempC = [40, 35, 30, 25, 20, 15, 10, 5, 0, -5, -10, -15];
let tempF = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, -10];
let colorScaleC = ["#6B1527FF", "#932929FF", "#B73466FF", "#DB6C54FF",
  "#E09F41FF", "#E1CE39FF", "#B7DA40FF", "#5BC94CFF",
  "#4DB094FF", "#4279BFFF", "#554FAAFF", "#1d2169"];


let colorScaleF = ["rgb(114,22,56)", "rgb(169,50,91)", "rgb(214,88,98)", "rgb(224,150,68)",
  "rgb(225,202,57)", "rgb(183,218,64)", "rgb(81,199,73)", "rgb(73,166,161)",
  "rgb(73,101,186)", "rgb(84,73,138)", "rgb(115,15,115)", "rgb(195,8,195)"]

let isCelsius = ref(true);

</script>

<template>

  <div id="scale-container" @click="isCelsius = !isCelsius">
    <div style="height: 30px; width: 100%; text-align: center; line-height: 30px; font-size: .9em; ">°{{ isCelsius ? 'C' : 'F' }}</div>
    <div id="color-wrapper">
      <div class="color" v-for="(t, index) in temp" key="index" :style="{backgroundColor: isCelsius ? colorScaleC[index] : colorScaleF[index]}">
          {{ t }}
      </div>
    </div>
  </div>

</template>

<style scoped>

#scale-container {
  width: 50px;
  height: 270px;
  background-color: white;
  user-select: none;

  &:hover {
    cursor: pointer;
  }

}

#color-wrapper {
  display: grid;
  width: 100%;
  height: 220px;
  grid-template-rows: repeat(12, 1fr);
}

.color {
  width: 50px;
  height: 20px;
  line-height: 20px;
  color: white;
  font-size: .9em;
  text-align: center;
}

</style>