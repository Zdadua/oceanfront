<script setup>

  import { marked } from "marked";
  import { markedHighlight } from "marked-highlight";
  import hljs from "highlight.js";

  let t = "# this is A Test"

  const options = {
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  }

  t = marked(t, options)

</script>

<template>

  <div v-html="t" id="test-div"></div>

</template>

<style scoped>

  #test-div {
    height: 500px;
    width: 500px;
    background-color: blue;
  }

</style>