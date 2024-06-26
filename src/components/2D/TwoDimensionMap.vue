<script setup>

import {computed, defineAsyncComponent, onMounted, ref} from "vue";
import { MapDrawer } from "../../js/map/MapDrawer.js";
import SearchBar from "./SearchBar.vue";
import TimeLine from "./TimeLine.vue";
import ToggleButton from "./ToggleButton.vue";
import CalendarCom from "./CalendarCom.vue";

const InfoCube = defineAsyncComponent(() => import("./InfoCube.vue"));

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

    <div id="info-cube-container" class="ui-control">
      <InfoCube></InfoCube>
    </div>

    <div id="timeline-container" class="ui-control">
      <TimeLine></TimeLine>
    </div>

    <div id="calendar-container" class="ui-control">
      <CalendarCom></CalendarCom>
    </div>

    <div id="controls-container" class="ui-control">
      <ToggleButton :name="'clickMode'" :left-text="'Point'" :right-text="'Cube'" style="top: 0;"></ToggleButton>
      <ToggleButton :name="'showMode'" :left-text="'Single'" :right-text="'Multi'" style="top: 0;"></ToggleButton>
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

#info-cube-container {
  right: 10px;
  bottom: 10px;
}

#controls-container {
  height: 200px;
  left: 100px;
  bottom: 100px;
}

#calendar-container {
  bottom: 25px;
  left: 40px;
}

</style>