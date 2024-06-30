<script setup>

import {ref} from "vue";

let array = Array.from({length: 10000}, (_, i) => i);

let list = ref(null);



</script>

<template>

  <div ref="list" id="virtual-scroll-container">
    <div class="virtual-scroll-phantom">
    </div>

    <div class="see-sight">
      <div v-for="item in array" class="see-sight-item">
        {{ item }}
      </div>
    </div>

  </div>

</template>

<style scoped>

#virtual-scroll-container {
  width: 200px;
  height: 400px;
  background-color: gray;
  position: relative;

}

.virtual-scroll-phantom {
  top: 0;
  left: 0;
  position: absolute;
}

.see-sight-item {
  height: 30px;
  line-height: 30px;
  width: 200px;
  text-align: center;
  color: white;
  background-color: #2a7fff;
  scroll-snap-align: start;
}

.see-sight {
  scroll-snap-type: y mandatory;
  height: 100%;
  overflow: auto;
}

</style>