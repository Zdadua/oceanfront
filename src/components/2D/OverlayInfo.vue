<script setup>

import {useStore} from "vuex";
import {nextTick, onMounted, ref} from "vue";
import TestChart from "./TestChart.vue";
import {toStringHDMS} from "ol/coordinate";
import {toLonLat} from "ol/proj";
import {Overlay} from "ol";

const store = useStore();

const props = defineProps({
  coordinate: {
    type: Object,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  // overlay: {
  //   type: Overlay,
  //   required: true
  // },
  // hiddenOverlay: {
  //   type: Overlay,
  //   required: true
  // }
});

let coordinateStr = ref();
let hided = ref(false);


function hideOverlay() {
  store.commit('mapForTwo/hide', this.id);
}

function removeOverlay() {
  store.commit('mapForTwo/removeOverlay', this.id);
}

function showOverlay() {
  store.commit('mapForTwo/show', this.id);
}

onMounted(() => {
    if(props.coordinate) {
      coordinateStr.value = toStringHDMS(toLonLat(props.coordinate))
    }
})

</script>

<template>
  <div class="overlay-info-container">
    <div v-if="!hided" class="visible-container">
      <div class="info-text">Current Position:</div>
      <div class="lon-lat">{{ coordinateStr }}</div>

      <div class="minimize-btn" @click="hideOverlay">
        <img src="../../assets/svg/minimize.svg" alt="minimize" width="15" height="15">
      </div>
      <div class="close-btn" @click="removeOverlay">
        <img src="../../assets/svg/close.svg" alt="close" width="15" height="15">
      </div>
    </div>

    <div v-if="hided" style="left: -5px; top: -5px; position: absolute; width: 10px; height: 10px;"></div>

  </div>

</template>

<style scoped>

.overlay-info-container {
  position: relative;
}

.visible-container {
  box-sizing: border-box;
  padding: 5px;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  left: -50px;
  background-color: white;
  border-radius: 10px;

  .info-text {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 1em;
    margin-bottom: 10px;
  }

  .lon-lat {
    max-width: 190px;
    height: 30px;
    align-content: center;
    line-height: 30px;
    font-size: .8em;
    background-color: #e4e4e4;
  }

  .close-btn {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    right: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  .minimize-btn {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    right: 35px;

    &:hover {
      cursor: pointer;
    }
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 40px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #ffffff transparent transparent transparent;
  }
}
</style>