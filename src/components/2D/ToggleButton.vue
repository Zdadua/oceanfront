<script setup>

import {useStore} from "vuex";
import {computed, onMounted} from "vue";

const props = defineProps({
  leftText: null,
  rightText: null,
  name: null,
})

const store = useStore();
let status = computed(() => store.state['mapForTwo'][props.name]);

function toggle() {
  if(status.value >= 2) {
    return;
  }

  store.commit('mapForTwo/' + props.name);
}

onMounted(() => {

})

</script>

<template>

  <div id="toggle-button-container" :class="{'locked': status >= 2}">
    <span class="toggle-text" :class="{'left-chosen': !(status % 2), 'not-chosen': status % 2}" style="width: 100px; left: -135px; text-align: right;">
      {{leftText}}
    </span>
    <div id="switch-container" @click="toggle">
      <div id="toggle" :class="{'right': status % 2, 'left': !(status % 2)}"></div>
    </div>
    <span class="toggle-text" :class="{'right-chosen': status % 2, 'not-chosen': !(status % 2)}" style="width: 100px; left: 15px;">
      {{rightText}}
    </span>
  </div>

</template>

<style scoped>

#toggle-button-container {
  position: relative;
  height: 30px;
}

.locked {
  filter: brightness(2);
}

#switch-container {
  position: absolute;
  left: -30px;
  background-color: #474747;
  height: 20px;
  width: 40px;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
  }

  &:active {
    filter: brightness(.7);
  }

  #toggle {
    width: 16px;
    height: 16px;
    border-radius: 8px;
    position: absolute;
    top: 2px;
    transition: left 0.3s ease-in-out, background-color 0.3s ease-in-out;;
  }

  .left {
    left: 2px;
    background-color: #c83200;
  }

  .right {
    left: 22px;
    background-color: #0032c8;
  }

}

.toggle-text {
  position: absolute;
  font-size: 1em;
  font-family: Arial, serif;
  height: 20px;
  line-height: 20px;
  font-weight: 700;
  user-select: none;

  transition: color .3s ease-in-out;
}

.left-chosen {
  color: #f15d2e;
}

.right-chosen {
  color: #3666ff;
}

.not-chosen {
  color: #6e6d6d;
}


</style>