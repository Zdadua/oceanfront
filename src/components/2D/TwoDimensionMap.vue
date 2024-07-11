<script setup>

import {computed, createApp, createVNode, defineAsyncComponent, nextTick, onMounted, ref} from "vue";
import { MapDrawer } from "../../js/map/MapDrawer.js";
import SearchBar from "./SearchBar.vue";
import TimeLine from "./TimeLine.vue";
import ToggleButton from "./ToggleButton.vue";
import CalendarCom from "./CalendarCom.vue";
import ColorScale from "./ColorScale.vue";
import CommonControls from "./CommonControls.vue";
import RightPopup from "./RightPopup.vue";
import {useStore} from "vuex";

const InfoCube = defineAsyncComponent(() => import("./InfoCube.vue"));

let store = useStore();
let mapContainer = ref();

let offset = computed(() => store.state['mapForTwo'].popup ? 700 : 0);

onMounted(() => {

  nextTick(() => {
    let drawer = new MapDrawer(mapContainer.value);
    drawer.init();
  })

})

</script>

<template>

  <div id="two-d-map-container" class="see-sight">
    <div id="map-guide-container" class="ui-control" :style="{'right': (10 + offset) + 'px'}">
      <div id="about-us-btn">
        <RouterLink id="router-link" to="/">
          AboutUs
        </RouterLink>
      </div>
      <div id="projection-name" >
        投影系: 墨卡托投影
      </div>
    </div>


    <div ref="mapContainer" id="map-container">
    </div>

    <div id="title-container" class="ui-control" :style="{'right':  'calc(50% - 270px + ' + offset * .6 + 'px)'}">
      基于物理增强和多级残差估计的海表温度预测系统
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

    <div id="popup-container" class="ui-control" :style="{'right': '0'}">
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

#map-container {
  width: 100vw;
  height: 100vh;
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
  top: 80px;
}

#map-guide-container {
  top: 20px;
  right: 10px;
  z-index: 10;
  display: flex;
  flex-direction: row;

  #projection-name {
    width: 200px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, .5);
    backdrop-filter: blur(5px);
    border-radius: 20px;
  }

  #about-us-btn {
    width: 140px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: white;
    border-radius: 20px;
    margin-right: 20px;
    font-size: 1.2em;
    font-family: UNSII Serif sans-serif;
    font-weight: 800;
  }
}

#title-container {
  width: 540px;
  height: 50px;
  top: 20px;
  line-height: 50px;
  text-align: center;
  color: white;
  font-size: 1.5em;
  font-weight: 400;
}

#router-link {
  text-decoration: none;
  color: black;
  width: 140px;
  height: 40px;
  font-family: UNSII, sans-serif;
  display: block;
}

#popup-container {
  top: 0;
  z-index: 10;
}

</style>