<script setup>

import {computed, ref} from "vue";
import {useStore} from "vuex";



const store = useStore();
let clicked = computed(() => store.state.onUI);

function clickSearch() {
  store.commit('setOnUI', 1);
}

</script>

<template>
  <div id="search-bar" :class="[!clicked ? 'bar-before-click' : 'bar-clicked']" @click="clickSearch">
    <span v-if="!clicked" id="search-text">搜索</span>
    <img id="search-img" alt="search" src="../../../public/static/svg/search.svg" width="20" height="20">
  </div>
</template>

<style scoped lang="less">

#search-bar {
  height: 40px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);

  &:hover > span {
    opacity: 1;
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
  width: 400px;
  border: 1px solid #4490ff;
}


#search-img {
  position: absolute;
  top: 10px;
  right: 10px;
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

@keyframes roll-out {
  0% {
    transform: scale(1, 1);
  }

  100% {
    transform: scale(5, 1);
  }
}

</style>