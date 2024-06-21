<script setup>

import {computed, onMounted, ref} from "vue";
import { MapDrawer } from "../../js/map/MapDrawer.js";

let mapContainer = ref(null);
let infoContainer = ref(null);

onMounted(() => {
  let drawer = new MapDrawer(mapContainer.value, infoContainer.value);
  drawer.init();

})

</script>

<template>

  <div id="two-d-map-container" class="see-sight">
    <div ref="mapContainer" id="map-container">
    </div>

    <div ref="infoContainer" id="info-container">
      <div id="info-text">Current Position:</div>
      <div v-if="true" id="lon-lat"></div>
    </div>

  </div>

</template>

<style scoped>

@import "../../styles/map/twoDimensionMap.css";

</style>