<script setup>

  // 获取传给该组件的参数
  import {computed, onMounted, ref} from "vue";

  const props = defineProps({
    title: String,
    text: String,
    backgroundColor: {
      type: String,
      required: false,
      default: 'black'
    },
    backgroundImage: {
      type: String,
      required: false,
      default: null,
    },
    shadowColor: {
      type: String,
      required: false,
      default: 'blue'
    }
  })

  let cube = ref(null);
  let mouseIn = ref(false);
  let cubeClass = computed(() => mouseIn ? 'cube-active' : 'cube-not-active');

  onMounted(() => {
    if(cube.value) {
      const rect = cube.value.getBoundingClientRect();


    }
  })

</script>

<template>
  <!-- 不知道会不会冲突 -->
  <div ref="cube" id="cube-container" :style="{'backgroundColor': props.backgroundColor}" :class="[cubeClass]" @mouseenter="mouseIn = true" @mouseleave="mouseIn = false">
    <div id="cube-title">
      <slot name="cube-title"></slot>
    </div>
    <div id="cube-text">
      <slot name="cube-text"></slot>
    </div>
  </div>

</template>

<style scoped lang="less">

  #cube-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 20px;
    border: 3px solid #474747;

  }

  .cube-not-active {
    box-shadow: 2px 2px 15px rgba(47, 66, 89, 0.8);
  }

  .cube-active {
    box-shadow: 2px 2px 40px rgb(66, 202, 14);
  }

  .default-container {
    color: white;
    background-color: black;
  }

</style>