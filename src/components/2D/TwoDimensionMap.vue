<script setup>

import {computed, createApp, createVNode, defineAsyncComponent, nextTick, onMounted, ref} from "vue";
import { MapDrawer } from "../../js/map/MapDrawer.js";
import SearchBar from "./SearchBar.vue";
import TimeLine from "./TimeLine.vue";
import ToggleButton from "./ToggleButton.vue";
import CalendarCom from "./CalendarCom.vue";
import ColorScale from "./ColorScale.vue";
import CommonControls from "./CommonControls.vue";
import OverlayInfo from "./OverlayInfo.vue";
import TestChart from "./TestChart.vue";
import RightPopup from "./RightPopup.vue";
import {useStore} from "vuex";

const InfoCube = defineAsyncComponent(() => import("./InfoCube.vue"));

let store = useStore();
let mapContainer = ref();
let infoContainer = ref();

let popped = ref(false);
let offset = computed(() => popped.value ? 700 : 0);
let overlays = computed(() => store.state['mapForTwo'].points);

function testClick() {
  popped.value = !popped.value;
}

onMounted(() => {
  const dom = document.createDocumentFragment();
  const tmp = createApp(OverlayInfo).mount(dom);

  const overlayElement = document.createElement('div');

  nextTick(() => {
    let drawer = new MapDrawer(mapContainer.value, tmp.$el);
    drawer.init();
  })

})

</script>

<template>

  <div id="two-d-map-container" class="see-sight">
    <div @click="testClick" class="ui-control" id="projection-name" :style="{'right': (10 + offset) + 'px'}">
      投影系: 墨卡托投影
    </div>

    <div ref="mapContainer" id="map-container">
      <OverlayInfo></OverlayInfo>
    </div>

    <div id="overlay-container">

    </div>

    <div id="search-container" class="ui-control">
      <SearchBar></SearchBar>
    </div>

    <div id="info-cube-container" class="ui-control">
      <InfoCube></InfoCube>
    </div>

    <div id="timeline-container" class="ui-control">
<!--      <TimeLine></TimeLine>-->
    </div>

    <div id="calendar-container" class="ui-control">
      <CalendarCom></CalendarCom>
    </div>

    <div id="color-scale-container" class="ui-control" :style="{'right': (30 + offset) + 'px'}">
      <ColorScale></ColorScale>
    </div>

    <div id="common-controls-container" class="ui-control" :style="{'right': (15 + offset) + 'px'}">
      <CommonControls></CommonControls>
    </div>

    <div id="popup-container" class="ui-control" :style="{'right': (-700 + offset) + 'px'}">
      <RightPopup></RightPopup>
    </div>

<!--    <div class="ui-control" style="top: 200px; left: 500px;">-->
<!--      <TestChart></TestChart>-->
<!--    </div>-->

    <div id="controls-container" class="ui-control">
      <ToggleButton :name="'clickMode'" :left-text="'Point'" :right-text="'Cube'" style="top: 0;"></ToggleButton>
      <ToggleButton :name="'showMode'" :left-text="'Single'" :right-text="'Multi'" style="top: 0;"></ToggleButton>
      <ToggleButton :name="'draggable'" :left-text="'Unlocked'" :right-text="'Locked'" style="top: 0;"></ToggleButton>
    </div>

<!--    <div ref="infoContainer" id="info-container">-->
<!--      <div id="info-text">Current Position:</div>-->
<!--      <div v-if="true" id="lon-lat"></div>-->
<!--    </div>-->

  </div>

</template>

<style scoped>

@import "../../styles/map/twoDimensionMap.css";

.ui-control {
  position: absolute;
  transition: right .3s ease-in-out;
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
  right: 85px;
  bottom: 10px;
}

#controls-container {
  height: 200px;
  left: 120px;
  bottom: 100px;
}

#calendar-container {
  bottom: 25px;
  left: 40px;
}

#color-scale-container {
  bottom: 50px;
}

#common-controls-container {
  top: 50px;
}

#popup-container {
  top: 0;
  z-index: 50;
}

#projection-name {
  width: 200px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, .5);
  backdrop-filter: blur(5px);
  top: 10px;
  border-radius: 10px;
  z-index: 10;
}

</style>