<script setup>

import {onMounted, ref} from "vue";

let offset = [...Array(24)].map((e, i) => 50 + i * 52);

function processOff(index) {
  return index < 10 ? '0' + index : index;
}


onMounted(() => {
  let domElement = document.getElementById('cursor');
  domElement.addEventListener('mousedown', (e) => {
    e.preventDefault();
    domElement.style.transition = 'none';

    const startX = e.clientX;
    const startLeft = domElement.offsetLeft;
    console.log(startLeft);
    const mouseMoveEvent = (e) => {
      const res = e.clientX - startX + startLeft;
      if(res < 44 || res > 1240) return;

      domElement.style.left = `${res}px`;
    };

    const mouseUpEvent = (e) => {
      domElement.style.transition = 'left .3s ease';
      let tmp = (domElement.offsetLeft -44) % 52;

      if(tmp <= 26) {
        domElement.style.left = `${domElement.offsetLeft - tmp}px`;
      }
      else {
        domElement.style.left = `${domElement.offsetLeft + 52 - tmp}px`;
      }

      document.removeEventListener("mousemove", mouseMoveEvent);
    }

    document.addEventListener('mousemove', mouseMoveEvent);
    document.addEventListener('mouseup', mouseUpEvent);
  })

})


</script>

<template>
  <div id="timeline">
    <div id="line"></div>
    <div v-for="(off, index) in offset" key="index" class="short-line" :style="{ left: off + 'px' }">
      <span>{{ processOff(index) }}:00</span>
    </div>

    <div id="cursor" v-show="true"></div>

  </div>
</template>

<style scoped>



#timeline {
  margin: 0 auto;
  position: relative;
  width: 1300px;
  height: 10px;
}

#line {
  position: absolute;
  top: 30px;
  width: 100%;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.34);
  border-radius: 5px;
}

.short-line {
  position: absolute;
  top: 40px;
  width: 4px;
  height: 15px;
  background-color: rgba(0, 0, 0, 0.34);

  span {
    display: block;
    transform: translate(-15px, 14px);
    color: white;
    font-size: .8em;
  }
}

#cursor {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: white;
  top: 25px;
  left: 44px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.49);
}

</style>