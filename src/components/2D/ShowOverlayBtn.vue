<script setup>

import {useStore} from "vuex";

const store = useStore();

const props = defineProps({
  idx: {
    type: Number,
    required: true
  }
})

function showClick() {
  store.commit('mapForTwo/show', props.idx);

}

</script>

<template>

  <div class="show-overlay-btn" @click="showClick">

  </div>

</template>

<style scoped>

.show-overlay-btn {
  width: 15px;
  height: 15px;
  border-radius: 8px;

  background-color: white;
}

</style>