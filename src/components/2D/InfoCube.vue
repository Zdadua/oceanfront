<script setup>

import {useStore} from "vuex";
import {computed, onMounted} from "vue";

const store = useStore();
let status = computed(() => store.state['mapForTwo'].clickMode);
let lon = computed(() => store.state['mapForTwo'].lon);
let lat = computed(() => store.state['mapForTwo'].lat);

onMounted(() => {

})

</script>

<template>
  <div v-if="status % 2" id="info-cube">
    <span class="cube-text">
      经度:<span style="padding-left: 15px">{{ lon }}</span>
    </span>

    <span class="cube-text">
      纬度:<span style="padding-left: 15px">{{ lat }}</span>
    </span>

  </div>

</template>

<style scoped>

#info-cube {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, .5);
  backdrop-filter: blur(5px);
  box-sizing: border-box;
  padding: 25px 10px;

  display: flex;
  flex-direction: column;
}

.cube-text {
  font-size: 1.1em;
  height: 30px;
  line-height: 30px;
  color: white;
}

</style>