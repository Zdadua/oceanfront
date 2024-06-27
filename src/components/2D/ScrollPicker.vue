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
      scroll.value.scrollBy(0, moveY);
    }

    const mouseUpEvent = (e) => {
      scroll.value.removeEventListener('mousemove', mouseMoveEvent);
    }
    scroll.value.addEventListener('mousemove', mouseMoveEvent);
    scroll.value.addEventListener('mouseup', mouseUpEvent);
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