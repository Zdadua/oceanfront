<script setup>

import {useStore} from "vuex";
import {onMounted, ref} from "vue";
import * as d3 from "d3";

const store = useStore();
let container = ref();

const depthMap = [0.494,
  1.541,
  2.646,
  3.819,
  5.078,
  6.441,
  7.930,
  9.573,
  11.405,
  13.467,
  15.810,
  18.496,
  21.599,
  25.211,
  29.445,
  34.434,
  40.344,
  47.374,
  55.764,
  65.807,
  77.854,
  92.326,
  109.729,
  130.666,
  155.851,
  186.126,
  222.475,
  266.040,
  318.127,
  380.213,
  453.938,
  541.089,
  643.567,
  763.333,
  902.339,
  1062.440,
  1245.291,
  1452.251,
  1684.284,
  1941.893];

const margin = {
  marginLeft: 25,
  marginRight: 20,
  marginTop: 10,
  marginBottom: 30
};

let svg;
let cursor;
let pane;
let w;
let h;
let yScale;
let tips;

function init() {
  initAxis();
  initPane();
  initCursor();
  initTips();
  initListener();
}

function initPane() {
  pane = svg.append('rect')
      .attr('id', 'pane')
      .attr('width', w)
      .attr('height', h)
      .attr('fill', 'transparent')
}

function initListener() {
  pane.on('click', (event) => {
    let depth = yScale.invert(event.offsetY);
    let f = Math.floor(depth);
    let s = Math.ceil(depth);

    let res = depth - f < s - depth ? f : s;

    cursor.attr('y', yScale(res) - 10);
    store.commit('mapForTwo/depth', res);

    svg.select('#depth').text(`${depthMap[res - 1]}m`);
  });

  cursor.call(d3.drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd));
}

let differ = 0;
function dragStart(event) {
  event.subject.fy = event.subject.y = parseFloat(cursor.attr('y'));
  differ = event.y - event.subject.fy;
}

function drag(event) {

  const y = Math.min(Math.max(event.y - differ, 0), h);
  const x = 0;

  cursor.attr('y', event.subject.y = y);
  tips.attr('transform', `translate(${(x - 10)}, ${y})`);
}

function dragEnd(event) {
  const depth = yScale.invert(event.y);

  let f = Math.floor(depth);
  let s = Math.ceil(depth);

  let res = depth - f < s - depth ? f : s;

  cursor.attr('y', yScale(res) - 10);
  store.commit('mapForTwo/depth', res);

  svg.select('#depth').text(`${depthMap[res - 1]}m`);
}

function initAxis() {
  initScale();

  const yAxis = d3.axisRight(yScale).ticks(5);

  svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${margin.marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2));
}

function initScale() {
  yScale = d3.scaleLinear();
  yScale.range([margin.marginTop, h - margin.marginBottom]);
  yScale.domain([1, 40]);
}

function initCursor() {
  cursor = svg.append('image')
      .attr('width', 20)
      .attr('height', 20)
      .attr('xlink:href', '/static/svg/rightCursor.svg')

  let x = 5;
  cursor.attr('x', x);
  cursor.attr('y', yScale(store.state['mapForTwo'].depth) - 10);
}

function initTips() {
  tips = svg.append('g')
      .attr('id', 'dTips')
      .style('display', 'none');

  tips.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 45)
      .attr('height', 20)
      .attr('fill', 'rgb(62,62,62)')
      .attr('stroke', 'rgb(39,39,39)')
      .attr('stroke-width', 1)

  tips.append('text')
      .attr('x', 3)
      .attr('y', 14)
      .attr('id', 'deep-tips')
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .style("fill", 'rgb(21,21,21)')

  const depth = depthMap[store.state['mapForTwo'].depth - 1];

  svg.append('text')
      .attr('id', 'depth')
      .attr('x', 2)
      .attr('y', 240)
      .style("font-size", "12px")
      .style('font-weight', '600')
      .style("font-family", "sans-serif")
      .style("fill", 'rgb(9,9,9)')
      .text(`${depth}m`)

  const y = 15;
  tips.attr('transform', `translate(0, ${y})`);
}

function createNode() {
  svg = d3.create('svg')
      .attr('id', 'line-svg')
      .attr('width', w)
      .attr('height', h);
}

onMounted(() => {
  w = container.value.offsetWidth;
  h = container.value.offsetHeight;

  createNode();
  container.value.appendChild(svg.node());

  init();
})

</script>

<template>
  <div ref="container" class="deep-line-container">

  </div>
</template>

<style scoped>

.deep-line-container {
  height: 100%;
  width: 100%;
}

</style>