<script setup>

import TextCube from "./TextCube.vue";
import LogoIcon from "./LogoIcon.vue";
import GuideBar from "./GuideBar.vue";
import anime from "animejs/lib/anime.es.js";
import {nextTick, onMounted, ref, watch} from "vue";

let observer = ref();

let precisionPart = ref();
let precisionShow = ref(false);

watch(() => precisionShow.value, (newValue) => {
  if(newValue === true) {
    const interval = setInterval(() => {
      if(precision.value < 10) {
        precision.value++;
      }
      else {
        clearInterval(interval);
      }
    }, 50);
    animateUp();
  }
})

function animateUp() {
  const paths = document.querySelectorAll("svg path");
  const arrow = document.querySelector("svg .st8");
  const plus = document.querySelector("#plus-svg");

  console.log(arrow);

  anime({
    targets: paths,
    translateY: {
      value: [1, 0], // 从20移动到0
      duration: 500, // 动画持续时间
      easing: 'easeInOutQuad' // 缓动函数
    },
    opacity: {
      value: [0, 1], // 从完全透明变为完全不透明
      duration: 500, // 与translateY动画同步
      easing: 'easeInOutQuad' // 缓动函数
    },
    duration: 2000,
    delay: (el, i) => (8 - i) * 100
  });

  anime({
    targets: arrow,
    opacity: {
      value: [0, 1],
      duration: 400,
      delay: 1300,
      easing: 'easeInOutQuad' // 缓动函数
    },
    translateY: {
      value: [.2, 0],
      duration: 400,
      delay: 1300,
      easing: 'easeInOutQuad' // 缓动函数
    }
  });

  anime({
    targets: plus,
    opacity: {
      value: [0, 1],
      duration: 400,
      delay: 1300,
      easing: 'easeInOutQuad' // 缓动函数
    },

  })

}


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
      <div v-show="precisionShow" style="grid-column: 2 / 3;">
        <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="400px" height="400px"
             viewBox="0 0 10.03 13.38" xml:space="preserve">
          <g>
            <path fill="#E71E21" class="st0" d="M4.71,2.72H4.49c0,0.35-0.03,0.7-0.04,1.05c0.1,0,0.2,0,0.3,0C4.73,3.41,4.71,3.07,4.71,2.72z"/>
            <path fill="#E61F73" class="st1" d="M4.45,3.9c-0.01,0.33-0.02,0.67-0.04,1c0.12,0,0.25,0,0.38,0c-0.02-0.33-0.02-0.67-0.04-1
      C4.65,3.9,4.55,3.9,4.45,3.9z"/>
            <path fill="#CC4292" class="st2" d="M4.41,5.05c-0.02,0.33-0.04,0.67-0.07,1c0.17,0,0.34,0,0.52,0c-0.03-0.33-0.05-0.67-0.07-1
      C4.66,5.05,4.53,5.05,4.41,5.05z"/>
            <path fill="#744598" class="st3" d="M4.85,6.19c-0.18,0-0.35,0-0.52,0c-0.02,0.25-0.03,0.5-0.06,0.76C4.27,7.03,4.26,7.11,4.25,7.19
      c0.23,0,0.46,0,0.69,0C4.94,7.11,4.92,7.03,4.91,6.95C4.89,6.69,4.88,6.44,4.85,6.19z"/>
            <path fill="#48459A" class="st4" d="M4.25,7.28c-0.04,0.33-0.07,0.67-0.12,1c0.31,0,0.63,0,0.94,0c-0.05-0.33-0.09-0.67-0.12-1
      C4.71,7.28,4.48,7.28,4.25,7.28z"/>
            <path fill="#2353A4" class="st5" d="M4.12,8.4c-0.05,0.33-0.11,0.67-0.18,1c0.43,0,0.87,0,1.3,0c-0.07-0.33-0.13-0.67-0.18-1
      C4.75,8.4,4.44,8.4,4.12,8.4z"/>
            <path fill="#2F71B9" class="st6" d="M3.95,9.49c-0.07,0.33-0.15,0.67-0.26,1c0.63,0,1.2,0,1.81,0c-0.1-0.33-0.18-0.67-0.26-1
      C4.81,9.49,4.38,9.49,3.95,9.49z"/>
            <path fill="#26BBE1" class="st7" d="M3.7,10.6c-0.06,0.19-0.1,0.35-0.35,0.56h2.52c-0.24-0.16-0.3-0.37-0.35-0.56C4.9,10.6,4.34,10.6,3.7,10.6z"/>
            <g>
              <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="4.5972" y1="10.3542" x2="4.5972" y2="2.0069">
                <stop  offset="0" style="stop-color:#3DBEED"/>
                <stop  offset="1" style="stop-color:#DC5310"/>
              </linearGradient>
              <polygon fill="url(#SVGID_1_)" class="st8" points="4.13,3.1 4.6,2.91 5.06,3.1 4.6,2.01 		"/>
            </g>
          </g>
        </svg>
      </div>
      <div v-show="precisionShow" style="grid-column: 3 / 4; box-sizing: border-box; padding: 100px 0; display: flex; flex-direction: row;">
        <span id="precise" :class="{'precise-animation': precisionShow}">{{ precision }}</span>
        <span style="font-size: 3em; color: white; font-family: Arial, serif; font-weight: 800; width: 100px; line-height: 250px;" :class="{'percent-animation': precisionShow}">%</span>
      </div>
      <div v-show="precisionShow" id="precise-info-container" style="grid-column: 4 / 5;">
        <div style="grid-column: 1 / 3" class="info-box" :class="{'info-box-animation': precisionShow}">
          <span class="info-text">ConvLSTM</span>
        </div>
        <div v-show="precisionShow" style="grid-column: 3 / 4; height: 120px; display: grid">
          <svg style="place-self: center;" id="plus-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50" height="50"
               viewBox="0 0 8.2 8.21" xml:space="preserve">
            <circle fill="none" stroke-width="0.25" stroke-miterlimit="10" stroke="#358ACB" class="p0" cx="4.1" cy="4.1" r="3.97"/>
            <path fill="#FFFFFF" class="p1" d="M6.24,4.53H1.97c-0.23,0-0.42-0.19-0.42-0.42v0c0-0.23,0.19-0.42,0.42-0.42h4.26c0.23,0,0.42,0.19,0.42,0.42v0
	C6.66,4.34,6.47,4.53,6.24,4.53z"/>
            <path fill="#FFFFFF" class="p2" d="M3.68,6.24V1.97c0-0.23,0.19-0.42,0.42-0.42h0c0.23,0,0.42,0.19,0.42,0.42v4.26c0,0.23-0.19,0.42-0.42,0.42h0
	C3.87,6.66,3.68,6.47,3.68,6.24z"/>
</svg>
        </div>
        <div style="grid-column: 4 / 6" class="info-box" :class="{'info-box-animation': precisionShow}">
          <span class="info-text">ConvGRU</span>
        </div>
        <div style="grid-column: 1 / 6">

        </div>
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
  grid-template-columns: 200px 250px 400px 1fr 200px;
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

#precise-info-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  .info-box {
    height: 120px;
    border-radius: 20px;
    border: 2px solid #00b2ff;
    box-shadow: 1px 1px 10px rgba(0, 210, 255, 0.82);
    transition: background-color .3s ease-in-out, transform .3s ease-in-out;
    display: grid;

    &:hover {
      cursor: pointer;
      background-color: white;
      transform: translate(-3px, -3px);
    }

  }

  .info-box-animation {
    animation: infoUp 1s ease-in-out forwards;
    animation-delay: 1s;
    opacity: 0;
  }

}

.precise-animation {
  animation: preciseUp .5s ease-in-out forwards;
}

.percent-animation {
  animation: percentUp .5s ease-in-out forwards;
}

.svg-animation {
  animation: svgUp .5s ease-in-out forwards;
}

@keyframes preciseUp {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }

    60% {
      opacity: 1;
      transform: translateY(0);
    }

    100% {
      color: #8585d1;
      opacity: 1;
    }
}

@keyframes percentUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  60% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes svgUp {
  0% {
    opacity: 0;
    transform: translateY(80px);
  }

  60% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes infoUp {
  0% {
    opacity: 0;
    transform: translateY(80px);
  }

  60% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-text {
  color: white;
  font-size: 3em;
  font-family: sans-serif;
  font-weight: 900;

  place-self: center;
}

</style>