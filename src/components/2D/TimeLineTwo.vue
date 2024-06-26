<script setup>

let offset = [...Array(24)].map((e, i) => 50 + i * 52);

</script>

<template>

  <div id="timeline">
    <div id="roll-container">
    </div>
  </div>

</template>

<style scoped>

#timeline {
  margin: 0 auto;
  position: relative;
  width: 1300px;
  height: 100%;
}

#roll-container {
  width: 100%;
  height: 70px;
  position: absolute;
  bottom: 0;
}

.red-line {
  background-color: red;
}

.white-line {
  background-color: white;
}

.line {
  width: 2px;
  height: 15px;
}

</style>