<script setup>

import {onMounted, ref} from "vue";

let props = defineProps({
  items: Array,
})

let scroll = ref(null);

onMounted(() => {
  const mouseDownEvent = (e) => {
    let startY = e.clientY;

    const mouseMoveEvent = (e) => {
      let moveY = e.clientY - startY;
      scroll.value.scrollBy(0, moveY * 0.1);
    }

    const mouseUpEvent = (e) => {
      window.removeEventListener('mousemove', mouseMoveEvent);
    }
    window.addEventListener('mousemove', mouseMoveEvent);
    window.addEventListener('mouseup', mouseUpEvent);
  }

  const wheelListener = (e) => {

  }

  scroll.value.addEventListener('mousedown', mouseDownEvent);

})

</script>

<template>

  <div id="scroll-container">
    <div class="target-center"></div>
    <div class="mask"></div>
    <div ref="scroll" class="scroll-wrapper">
      <div class="item"></div>
      <div v-for="item in items" key="index" class="item">
        {{ item }}
      </div>
      <div class="item"></div>

    </div>
  </div>

</template>

<style scoped>


#scroll-container {
  width: 100%;
  height: 90px;
  position: relative;

  .scroll-wrapper {
    overflow-y: auto;
    scrollbar-width: none;
    height: 90px;
    scroll-snap-type: y mandatory;
    div {
      scroll-snap-align: center;
      height: 30px;
      text-align: center;
      line-height: 30px;
      user-select: none;
    }

  }

}


</style>