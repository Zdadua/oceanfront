<script setup>

import {computed, nextTick, ref} from "vue";
import {useStore} from "vuex";
import {abs, floor, round} from "mathjs";
import {fromLonLat, toLonLat} from "ol/proj";
import {DotOverlay} from "../../js/map/DotOverlay.js";
import {easeOut} from "ol/easing.js";



const store = useStore();
let clicked = computed(() => store.state['mapForTwo'].onUI);
let inputType = ref(false);

let lon = ref();
let lonD = ref();
let lonM = ref();
let lonS = ref();
let positiveLon = ref(true);

let lat = ref();
let latD = ref();
let latM = ref();
let latS = ref();
let positiveLat = ref(true);

let coordinate = computed(() => {
  let longitude;
  let latitude;
  if(!inputType.value) {
    longitude = lon.value;
    latitude = lat.value;
  }
  else {
    longitude = (lonD.value + lonM.value / 60 + lonS.value / 3600) * (positiveLon.value ? 1 : -1);
    latitude = (latD.value + latM.value / 60 + latS.value / 3600) * (positiveLat.value ? 1 : -1);
  }

  return fromLonLat([longitude, latitude]);
})


function clickSearch() {
  if(!store.state['mapForTwo'].onUI) {
    store.commit('mapForTwo/setOnUI', 1);
    nextTick(() => {
      if(!inputType.value) {
        document.getElementById('lon').focus();
      }
      else {
        document.getElementById('lonD').focus();
      }

    });
  }
}

function changeClick() {
  inputType.value = !inputType.value;

  if(inputType.value) {
    if (lon.value) {
      if (lon.value < 0) {
        positiveLon.value = false;
      }
      let tmpLon = abs(lon.value);
      lonD.value = floor(tmpLon);
      lonM.value = floor((tmpLon - lonD.value) * 60);
      lonS.value = round(((tmpLon - lonD.value) * 60 - lonM.value) * 60 * 1000) / 1000;

    }
    if (lat.value) {
      if (lat < 0) {
        positiveLat.value = false;
      }
      let tmpLat = abs(lat.value);
      latD.value = floor(tmpLat);
      latM.value = floor((tmpLat - latD.value) * 60);
      latS.value = round(((tmpLat - latD.value) * 60 - latM.value) * 60 * 1000) / 1000;
    }
  }
  else {
    if(lonD.value || lonM.value || lonS.value) {
      lon.value = ((lonD.value ? lonD.value : 0) + (lonM.value ? lonM.value / 60 : 0) + (lonS.value ? lonS.value / 3600 : 0)) * (positiveLon.value ? 1 : -1);
      lon.value = lon.value.toFixed(3);
    }

    if(latD.value || latM.value || latS.value) {
      lat.value = ((latD.value ? latD.value : 0) + (latM.value ? latM.value / 60 : 0) + (latS.value ? latS.value / 3600 : 0)) * (positiveLat.value ? 1 : -1);
      lat.value = lat.value.toFixed(3);
    }
  }
}

function enterClick() {
  if(store.state['mapForTwo'].showMode) {
    store.state['mapForTwo'].dotIdx++;
  }
  let dotOverlay = new DotOverlay(store.state['mapForTwo'].dotIdx, coordinate.value);
  dotOverlay.initDotOverlay().then(() => {
    console.log(toLonLat(coordinate.value));
    store.commit('mapForTwo/pushPoint', dotOverlay);
    let view = store.state['mapForTwo'].map.getView();
    view.animate({
      center: coordinate.value,
      duration: 800,
      easing: easeOut
    });
  })
}

function lonChangeClick() {
  positiveLon.value = !positiveLon.value;
}

function latChangeClick() {
  positiveLat.value = !positiveLat.value;
}

</script>

<template>
  <div id="search-bar" :class="[!clicked ? 'bar-before-click' : 'bar-clicked']" @click="clickSearch">
    <span v-if="!clicked" id="search-text">搜索</span>
    <div id="search-img" @click="enterClick">
      <img alt="search" src="../../../public/static/svg/search.svg" width="20" height="20">
    </div>

    <div v-if="clicked" id="change-container" @click="changeClick">
      <img alt="search" src="../../assets/svg/change.svg" width="20" height="20">
    </div>

    <div v-if="clicked" id="input-wrapper">
      <span>经度:</span>
      <div class="big-input-container">
        <div v-if="!inputType" class="input-container">
          <input class="decimal-input" id="lon" v-model="lon" type="number">
        </div>
        <div v-if="inputType" class="input-container">
          <input id="lonD" class="degree-input" v-model="lonD" type="number">°
          <input class="degree-input" v-model="lonM" type="number">'
          <input class="degree-input" v-model="lonS" type="number">"

          <div class="direction-container" @click="lonChangeClick">
            {{ positiveLon ? 'N' : 'S' }}
          </div>
        </div>
      </div>

      <span>纬度:</span>
      <div class="big-input-container">
        <div v-if="!inputType" class="input-container">
          <input class="decimal-input" id="lat" v-model="lat" type="number">
        </div>
        <div v-if="inputType" class="input-container">
          <input class="degree-input" v-model="latD" type="number">°
          <input class="degree-input" v-model="latM" type="number">'
          <input class="degree-input" v-model="latS" type="number">"

          <div class="direction-container" @click="latChangeClick">
            {{ positiveLat ? 'E' : 'W' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

#search-bar {
  height: 40px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &:hover > span {
    opacity: 1;
  }

  #input-wrapper {
    position: absolute;
    display: flex;
    flex-direction: row;

    span {
      padding-left: 15px;
      width: 40px;
      height: 30px;
      line-height: 30px;
      margin: 5px 0;
    }
  }

  .big-input-container {
    box-sizing: border-box;
    width: 200px;
    height: 36px;
    margin: 2px 0;
  }

  .input-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
  }

  .decimal-input {
    width: 100%;
    height: calc(100% - 6px);
    box-sizing: border-box;
    font-size: .9em;


    border: 1px solid #aeaeae;
    border-radius: 5px;

    &:focus {
      border: 1px solid #4fbeff;
      border-radius: 5px;
    }
  }

  .degree-input {
    width: 20%;
    margin: 0 2px;
    height: calc(100% - 6px);
    box-sizing: border-box;
    font-size: .9em;


    border: 1px solid #aeaeae;
    border-radius: 5px;

    &:focus {
      border: 1px solid #4fbeff;
      border-radius: 5px;
    }
  }

  .direction-container {
    margin-left: 10px;
    box-sizing: border-box;
    padding: 0 10px;
    width: 20%;
    height: 35px;
    line-height: 35px;
    font-size: 1.2em;
    text-align: center;
    user-select: none;

    &:hover {
      cursor: pointer;
    }

  }

}

#change-container {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  right: 40px;
  margin-right: 10px;

  &:hover {
    cursor: pointer;
  }
}

.bar-before-click {
  width: 40px;
  transition: width .2s ease;

  &:hover {
    width: 90px;
    cursor: pointer;
  }

}

.bar-clicked {
  width: 600px;
  border: 1px solid #4490ff;
}


#search-img {
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  right: 0;

  &:hover {
    cursor: pointer;
  }
}

#search-text {
  position: absolute;
  top: 8px;
  left: 18px;
  height: 20px;
  width: 40px;
  letter-spacing: 3px;
  color: gray;
  font-size: 1em;
  opacity: 0;
  transition-delay: .2s;
  transition: opacity .2s ease;
}


</style>