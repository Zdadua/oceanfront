<script setup>

import {useStore} from "vuex";
import {computed} from "vue";

const props = defineProps({
  url: {
    default: '',
    type: String
  },
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    default: 'non yet'
  },
  alt: {
    type: String,
    default: 'no alt'
  }
});

const store = useStore();

let mode = computed(() => store.state['mapForTwo'][props.name]);

function modeClick() {
  store.commit(`mapForTwo/${props.name}`);
}

</script>

<template>

  <div class="toggle-btn-container">
    <div class="icon-wrapper" @click="modeClick">
      <img :src="props.url" :alt="props.name" width="20" height="20">
    </div>
    <div class="toggle-bar" :class="[mode ? 'clicked' : 'not-clicked']" @click="modeClick">
      <span>{{props.text}}</span>
    </div>
  </div>

</template>

<style scoped>

.toggle-btn-container {
  position: relative;
  margin-bottom: 10px;
}

.icon-wrapper {
  width: 20px;
  height: 20px;
  padding: 5px;
  border-radius: 15px;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;

  &:hover {
    cursor: pointer;
  }
}

.toggle-bar {
  width: 140px;
  height: 26px;
  margin: 2px 0 2px 15px;

  border-radius: 0 15px 15px 0;
  transition: all .2s ease-in-out;

  span {
    height: 26px;
    line-height: 26px;
    padding-left: 1.1em;
    font-weight: 800;
    font-family: "Microsoft JhengHei UI", sans-serif;
  }

}

.not-clicked {
  background-color: rgba(186, 186, 186, 0.8);
  box-shadow:  4px 1px 7px rgba(244, 180, 134, 0.4);
  color: #000000;

  &:hover {
    box-shadow:  2px 1px 10px rgba(244, 180, 134, 0.8);
    cursor: pointer;
  }
}

.clicked {
  background-color: rgba(255, 137, 0, 0.8);
  box-shadow:  4px 1px 7px rgba(186, 186, 186, 0.4);
  color: #ffffff;

  &:hover {
    box-shadow:  2px 1px 10px rgba(186, 186, 186, 0.8);
    cursor: pointer;
  }
}

</style>