<script setup>

const props = defineProps({
  url: {
    default: '',
    type: String
  },
  name: {
    type: String,
    required: true
  }
});

</script>

<template>

  <div class="toggle-btn-container">
    <div class="icon-wrapper">

    </div>
    <div class="toggle-bar">
    </div>
  </div>

</template>

<style scoped>

.toggle-bar {
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
}

</style>