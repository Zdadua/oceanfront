<script setup>

import TextCube from "./TextCube.vue";
import LogoIcon from "./LogoIcon.vue";
import GuideBar from "./GuideBar.vue";
import anime from "animejs/lib/anime.es.js";
import {nextTick, onMounted, ref} from "vue";

let observer = ref();

let precisionPart = ref();
let precisionShow = ref(false);

// function animateUp() {
//   const paths = document.querySelectorAll("svg path");
//
//   anime({
//     targets: paths,
//     easing: 'easeInOutQuad',
//     strokeDashoffset: [anime.setDashoffset, 0],
//     duration: 2000,
//     delay: (el, i) => i * 200
//   })
// }


let precision = ref(0);
onMounted(() => {
  const options = {
    root: null,
    threshold: 0.8,
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting) {
        if(entry.target === precisionPart.value) {
          precisionShow.value = true;
        }



      }
    })
  }, options)

  observer.value.observe(precisionPart.value);
})


</script>

<template>
  <div id="about-us-container">
    <GuideBar class="full-bleed" />

    <div id="logo-container" class="full-bleed">
      <LogoIcon />
    </div>

    <div id="info-container" class="sec-container full-bleed">
      <div id="grid-container">
        <TextCube class="first" background-image="./public/static/svg/card01.svg">
          <div class="title" style="top: 20px; right: 90px;">
            设计理念
          </div>
          <div class="text">

          </div>
        </TextCube>
        <TextCube class="second" background-image="none">
          
        </TextCube>
        <TextCube class="third" background-image="none" />
        <TextCube class="fourth" background-image="none" />
      </div>
    </div>

    <div ref="precisionPart" class="show-container sec-container full-bleed" style="height: 400px">
      <img v-show="precisionShow" style="grid-column: 2 / 3;" alt="" src="../../assets/svg/upArrow.svg" width="400" height="400">
      <div v-show="precisionShow" style="grid-column: 3 / 4; box-sizing: border-box; padding: 100px 0; display: flex; flex-direction: row;">
        <span id="precise">{{ precision }}</span>
        <span style="font-size: 3em; color: white; font-family: Arial, serif; font-weight: 800; width: 100px; line-height: 250px;">%</span>
      </div>
    </div>

<!--    <div id="pic-container" class="sec-container">-->
<!--&lt;!&ndash;      <PicLib />&ndash;&gt;-->
<!--    </div>-->

  </div>
</template>

<style scoped lang="less">

@import "../../styles/aboutUs/aboutUs.css";

.title {
  position: absolute;
  font-size: 2.2em;
  color: white;
}

.show-container {
  height: 400px;
  position: relative;

  display: grid;
  grid-template-columns: 200px 400px 400px 1fr 200px;

}

#logo-container {
  display: flex;
  justify-content: center;
  align-content: center;

  background-image:
      radial-gradient(closest-side, rgba(0, 75, 186, 0.5), rgba(0, 255, 234, 0)),
      radial-gradient(closest-side, rgb(248, 132, 0), rgba(0, 255, 234, 0)),
      radial-gradient(closest-side, rgba(120, 248, 0, 0.82), rgba(0, 255, 234, 0));
  background-repeat: no-repeat;

  animation: gradient 5s ease-in-out infinite alternate;
}

@keyframes gradient {
  0%, 100% {
    background-position:
        center,
        400px 200px,
        60% 60%;
    background-size:
        1000px 800px,
        500px 500px,
        500px 500px;
  }

  50% {
    background-position:
        55% 60%,
        400px 200px,
        70% 65%;
    background-size:
        1000px 800px,
        400px 400px,
        450px 450px;
  }
}

#precise {
  width: 200px;
  color: white;
  font-size: 10em;
  font-family: sans-serif;
}

</style>