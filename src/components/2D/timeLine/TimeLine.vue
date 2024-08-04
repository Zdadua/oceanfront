<script setup>

import {computed, onMounted, ref} from "vue";
import * as d3 from "d3";
import {useStore} from "vuex";

const store = useStore();
let container = ref();

let year = computed(() => store.state['mapForTwo'].year);
let month = ref();
let day = ref();

let margin = {
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 40
};
let svg;
let cursor;
let pane;
let w;
let h;
let xScale;
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
    const tmpDate = xScale.invert(event.offsetX);
    month.value = tmpDate.getMonth() + 1;
    day.value = tmpDate.getDate();
    const date = new Date(Date.UTC(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()));

    cursor.attr('x', xScale(date) - 10);
    tips.attr('transform', `translate(${xScale(date) - 20}, 15)`);

    tips.select('#date-tips').text(`${month.value < 10 ? ('0' + month.value) : month.value}/${day.value < 10 ? ('0' + day.value) : day.value}`);
  });

  cursor.on('mouseover', (event) => {
    svg.select('#tips')
        .style('display', null)
    })
    .on('mouseout', (event) => {
      svg.select('#tips')
          .style('display', 'none')
    })
}

function initCursor() {
  cursor = svg.append('image')
      .attr('width', 20)
      .attr('height', 20)
      .attr('xlink:href', './src/assets/svg/cursor.svg')

  const date = new Date(Date.UTC(year.value, month.value - 1, day.value));
  let x = xScale(date) - 10;
  let y = h - margin.marginBottom - 20;

  cursor.attr('x', x)
      .attr('y', y);
}

function initTips() {
  tips = svg.append('g')
      .attr('id', 'tips')
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
      .attr('id', 'date-tips')
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .style("fill", 'rgb(251,251,251)')
      .text(`${month.value < 10 ? ('0' + month.value) : month.value}/${day.value < 10 ? ('0' + day.value) : day.value}`);



  const x = cursor.attr('x') - 10;
  const y = 15;

  tips.attr('transform', `translate(${x}, ${y})`);
}

function initAxis() {
  initScale();

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%B')).ticks(d3.timeMonth.every(1));

  svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${h - margin.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2))
}

function initScale() {
  xScale = d3.scaleUtc();
  xScale.range([margin.marginLeft, w - margin.marginRight]);
  xScale.domain([new Date(year.value, 0, 1), new Date(year.value, 11, 31)]);
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

  month.value = store.state['mapForTwo'].month;
  day.value = store.state['mapForTwo'].day;

  createNode();
  container.value.appendChild(svg.node());

  init();
})

</script>

<template>
  <div ref="container" id="line-container">

  </div>

</template>

<style scoped>

#line-container {
  height: 100px;
}

.pane-hover {
  &:hover {
    cursor: pointer;
  }
}

</style>