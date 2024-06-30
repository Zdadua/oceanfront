<script setup>

const temp = [40, 35, 30, 25, 20, 15, 10, 5, 0, -5, -10, -15];
let colorScale = ["#91003b", "#bf002f", "#ff4400", "#ffae00",
  "#d0e600", "#46bc00", "#00bfaf", "#0070b5",
  "#0032ff", "#0021d1", "#5700ec", "#380088"];

let colors = temp.map((e, i) => {
  return {
    temp: e,
    color: colorScale[i],
  }
})

</script>

<template>

  <div id="scale-container">
    <div style="height: 30px; width: 100%; text-align: center; line-height: 30px; font-size: .9em; ">温度(°)</div>
    <div id="color-wrapper">
      <div class="color" v-for="(t, index) in temp" :style="{backgroundColor: colorScale[index]}">
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