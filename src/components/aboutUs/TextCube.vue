<script setup>

import {onMounted, ref} from "vue";

const props = defineProps({
  title: String,
  content: String,
})

let x = ref(0);
let y = ref(0);

function spotlight(event) {
  let rect = document.getElementById('top').getBoundingClientRect();
  document.getElementById('top').style
  x.value = event.clientX - rect.width;
  y.value = event.clientY - rect.height;
  console.log(x.value, y.value);
}

onMounted(() => {

})

</script>

<template>

  <div id="out-container" @mousemove="spotlight">
    <div class="text" id="bottom">
      Hello,world
    </div>
    <div class="text" id="top" :style="{clipPath: 'circle(150px at 95px -15px)'}">
      Hello,world
    </div>
  </div>

</template>

<style scoped>

#out-container {
  width: 50%;
  height: 400px;
  margin-top: 300px;
  position: relative;
}

#bottom {
  //background-color: black;
  color: #6f09b3;
}

#top {
  color: #ff6e00;
}

.text {
  width: 100%;
  height: 50%;
  font-size: 80px;
  font-weight: 900;
  letter-spacing: 5px;
  position: absolute;
  line-height: 200px;
}

</style>