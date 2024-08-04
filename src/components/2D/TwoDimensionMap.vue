<script setup>

import {computed, nextTick, onMounted, ref} from "vue";
import { MapDrawer } from "../../js/map/MapDrawer.js";
import SearchBar from "./SearchBar.vue";
import TimeLineButton from "./timeLine/TimeLineButton.vue";
import CalendarCom from "./CalendarCom.vue";
import ColorScale from "./ColorScale.vue";
import CommonControls from "./CommonControls.vue";
import RightPopup from "./RightPopup.vue";
import ButtonField from "./buttonField/ButtonField.vue";
import {useStore} from "vuex";
import TimeLine from "./timeLine/TimeLine.vue";

let store = useStore();
let mapContainer = ref();

let offset = computed(() => store.state['popup'].popup ? 700 : 0);

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

    <div class="ui-control" id="logo-container" :style="{'left': 20 + 'px', 'top': 10 + 'px', 'z-index': '20'}">
      <img src="../../assets/svg/singleLogo.svg" width="160" height="60">
    </div>

    <div ref="mapContainer" id="map-container">
    </div>

    <div id="overlay-container">

    </div>

    <div id="search-container" class="ui-control">
      <SearchBar></SearchBar>
    </div>

<!--    <div id="timeline-container" class="ui-control">-->
<!--&lt;!&ndash;      <TimeLine></TimeLine>&ndash;&gt;-->
<!--    </div>-->

    <div id="btn-field-wrapper" class="ui-control">
      <ButtonField></ButtonField>
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

    <div id="bottom-container" class="ui-control">
      <CalendarCom style="grid-column: 2 / 3; place-self: center;"></CalendarCom>
      <TimeLineButton style="grid-column: 4 / 5; place-self: center;"></TimeLineButton>
      <TimeLine style="grid-column: 6 / 7; align-self: end"></TimeLine>
    </div>

    <div id="time-line-wrapper" class="ui-control" :style="{'left': '350px', 'bottom': '25px'}">

    </div>

<!--    <div id="controls-container" class="ui-control">-->
<!--      <ToggleButton :name="'showMode'" :left-text="'Single'" :right-text="'Multi'" style="top: 0;"></ToggleButton>-->
<!--      <ToggleButton :name="'draggable'" :left-text="'Unlocked'" :right-text="'Locked'" style="top: 0;"></ToggleButton>-->
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
  left: 220px;
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
    box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);
  }
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

#logo-container {
  height: 60px;
  width: 180px;
  background-color: #cccccc;
  box-sizing: border-box;
  padding: 0 8px;
  border-radius: 20px;
}

#btn-field-wrapper {
  left: 0;
  bottom: 400px;
}

#bottom-container {
  display: grid;
  bottom: 0;
  height: 100px;
  width: 100vw;
  grid-template-columns: 30px 250px 30px 90px 30px 1fr 140px;
}

</style>