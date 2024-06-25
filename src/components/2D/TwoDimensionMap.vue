<script setup>

import {computed, onMounted, ref} from "vue";
import { MapDrawer } from "../../js/map/MapDrawer.js";
import SearchBar from "./SearchBar.vue";
import TimeLine from "./TimeLine.vue";
import InfoCube from "./InfoCube.vue";

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

    <div id="search-container" class="ui-control">
      <SearchBar></SearchBar>
    </div>

    <div id="timeline-container" class="ui-control">
      <TimeLine></TimeLine>
    </div>

    <div id="point-info-container" class="ui-control">
      <InfoCube></InfoCube>
    </div>

    <div ref="infoContainer" id="info-container">
      <div id="info-text">Current Position:</div>
      <div v-if="true" id="lon-lat"></div>
    </div>

  </div>

</template>

<style scoped>

@import "../../styles/map/twoDimensionMap.css";

.ui-control {
  position: absolute;
}

#search-container {
  top: 20px;
  left: 200px;
}

#timeline-container {
  width: 100%;
  bottom: 0;
  height: 80px;
}

#point-info-container {
  bottom: 10px;
  right: 10px;
}


</style>