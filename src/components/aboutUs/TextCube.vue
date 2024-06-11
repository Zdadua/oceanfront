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
      default: 'none',
    },
    shadowColor: {
      type: String,
      required: false,
      default: 'blue'
    }
  })

  let cube = ref(null);
  let mouseIn = ref(false);
  let cubeClass = computed(() => mouseIn.value ? 'cube-active' : 'cube-not-active');

  onMounted(() => {
    if(cube.value) {
      const rect = cube.value.getBoundingClientRect();

      console.log(mouseIn.value)
    }
  })

</script>

<template>
  <!-- 不知道会不会冲突 -->
  <div ref="cube" id="cube-container" :style="{'backgroundColor': props.backgroundColor, 'backgroundImage': 'url(' + props.backgroundImage + ')' }" :class="[cubeClass]" @mouseenter="mouseIn = true" @mouseleave="mouseIn = false">

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

  }

  .cube-not-active {
    box-shadow: 0 0 5px rgba(60, 72, 96, 0.8);
    transform: translate(0, 0);
    transition: box-shadow 0.5s ease, transform 0.5s ease;
  }

  .cube-active {
    box-shadow: 4px 4px 20px rgb(87, 145, 65);
    transform: translate(-2px, -2px);
    transition: box-shadow 0.5s ease, transform 0.5s ease;
  }

  .default-container {
    color: white;
    background-color: black;
  }

</style>