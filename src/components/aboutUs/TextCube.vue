<script setup>

  // 获取传给该组件的参数
  import {onMounted, ref} from "vue";

  const props = defineProps({
    title: String,
    text: String,
  })

  let cube = ref(null);

  onMounted(() => {
    if(cube.value) {
      const rect = cube.value.getBoundingClientRect();
    }
  })

</script>

<template>
  <!-- 不知道会不会冲突 -->
  <div ref="cube" id="cube-container">

  </div>

</template>

<style scoped>

</style>