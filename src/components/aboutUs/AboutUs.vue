<script setup>

import TextCube from "./TextCube.vue";
import PicLib from "./PicLib.vue";
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
        <TextCube class="first" background-image="./public/static/svg/card01.svg" />
        <TextCube class="second" background-image="none" />
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

</style>