<script setup>

import {useStore} from "vuex";
import {computed, onMounted} from "vue";
import ToggleButton from "./ToggleButton.vue";

const store = useStore();

let popup = computed(() => {
  return store.state['button'].popup;
});

function btnFieldClick() {
  store.commit('button/popup');
}

onMounted(() => {

})


</script>

<template>

  <div id="btn-field-container" :style="{'left': (popup ? '0' : '-200') + 'px'}">
    <div id="toggle-btn" @click="btnFieldClick">
      <img :class="{'rotate': popup}" src="../../../assets/svg/right.svg" alt="right" width="20" height="20">
    </div>

    <div id="toggle-btn-container">
      <ToggleButton name="showMode" url="src/assets/svg/pinpoint.svg" text="多点模式"></ToggleButton>
    </div>

  </div>

</template>

<style scoped>

#btn-field-container {
  position: absolute;
  transition: all .3s ease-in-out;
}

#toggle-btn-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  border-radius: 0 0 15px 0;
  box-sizing: border-box;
  width: 200px;
  height: 300px;
  padding: 20px 10px;
  box-shadow: 2px 2px 5px rgba(55, 55, 55, 0.2);
}

#toggle-btn {
  display: flex;
  align-self: center;
  justify-content: center;
  position: absolute;
  right: -26px;
  width: 25px;
  padding: 4px 0;
  top: 0;
  background-color: white;
  border-radius: 0 10px 10px 0;
  box-shadow: 4px 2px 5px rgba(55, 55, 55, 0.2);

  transition: all .3s linear;

  &:hover {
    cursor: pointer;
    box-shadow: 4px 2px 5px rgba(19, 19, 19, 0.4);
  }

  img {
    transition: all .3s ease-in-out;
  }

}

.rotate {
  transform: rotate(180deg);
}


</style>