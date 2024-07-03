<script setup>

import {computed, nextTick} from "vue";
import {useStore} from "vuex";



const store = useStore();
let clicked = computed(() => store.state['mapForTwo'].onUI);


function clickSearch() {
  if(!store.state['mapForTwo'].onUI) {
    store.commit('mapForTwo/setOnUI', 1);
    nextTick(() => {
      document.getElementById('lon').focus();
    });
  }
}

</script>

<template>
  <div id="search-bar" :class="[!clicked ? 'bar-before-click' : 'bar-clicked']" @click="clickSearch">
    <span v-if="!clicked" id="search-text">搜索</span>
    <img id="search-img" alt="search" src="../../../public/static/svg/search.svg" width="20" height="20">
    <div v-if="clicked" id="input-wrapper">
      <span>经度:</span>
      <input id="lon">
      <span>纬度:</span>
      <input id="lat">
    </div>
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

    input {
      box-sizing: border-box;
      width: 150px;
      height: 36px;
      margin: 2px 0;

      &:focus {
        border: 1px solid #4fbeff;
        border-radius: 2px;
      }

    }

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
  width: 500px;
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