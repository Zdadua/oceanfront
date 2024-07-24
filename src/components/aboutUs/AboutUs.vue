<script setup>

import TextCube from "./TextCube.vue";
import LogoIcon from "./LogoIcon.vue";
import GuideBar from "./GuideBar.vue";

</script>

<template>
  <div id="about-us-container">
    <GuideBar class="full-bleed" />
    <div id="three-earth-container" class="sec-container mid-grid">
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

</style>