<script setup>

</script>

<template>

  <div id="guide-bar-container">
    <div id="router-wrapper">
      <RouterLink to="/twoMap" class="btn-wrapper" id="map">
        地图
      </RouterLink>
      <div class="btn-wrapper" id="about-us">
        关于我们
      </div>
    </div>

  </div>

</template>

<style scoped lang="less">

#guide-bar-container {
  width: 100%;
  height: 50px;
  background-color: black;


  &::after {
    display: block;
    position: absolute;
    left: 50px;
    right: 50px;
    top: 50px;
    content: "";
    height: 1px;
    box-shadow: 0 0 20px rgba(56, 149, 255, 0.5);
    background-color: #76cfc4;
  }

  #router-wrapper {
    display: flex;
    flex-direction: row;
    position: absolute;
    right: 50px;

    .btn-wrapper {
      color: white;
      margin: 3px;
      width: 75px;
      text-align: center;
      font-size: .9em;
      line-height: 44px;
      border-radius: 8px;
      background-color: transparent;
      transition: background-color .3s ease-in-out;
      text-decoration: none;

      &:hover {
        background-color: #2c2c2c;
        cursor: pointer;
      }

    }
  }
}

</style>