<script setup>

import {computed, onMounted, ref, watch, watchEffect} from "vue";
import * as d3 from "d3";
import {useStore} from "vuex";

const store = useStore();
let container = ref();

let year = computed(() => store.state['mapForTwo'].year);
let unit = computed(() => store.state['mapForTwo'].unit);
let month = ref();
let day = ref();
let time = ref();

let svg;
let cursor;
let pane;
let w;
let h;
let xScale;
let tips;

let margin = {
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 40
};


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
    let tmpDate = xScale.invert(event.offsetX);

    if(unit.value === 0) {
      const date = new Date(Date.UTC(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()));

      store.commit('mapForTwo/year', date.getFullYear());
      store.commit('mapForTwo/tmpMonth', date.getMonth() + 1);
      store.commit('mapForTwo/day', date.getDate());
    }
    else {
      let tmp = tmpDate % 6;

      if(tmp < 3) {
        tmpDate = tmpDate - tmp;
      }
      else {
        tmpDate = tmpDate + (6 - tmp);
      }
      store.commit('mapForTwo/time', tmpDate);
    }

  });

  cursor.on('mouseover', (event) => {
    svg.select('#tips')
        .style('display', null)
    })
    .on('mouseout', (event) => {
      svg.select('#tips')
          .style('display', 'none')
    });

  cursor.call(d3.drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd));
}

let differ = 0;
function dragStart(event) {
  event.subject.fx = event.subject.x = parseFloat(cursor.attr('x'));
  differ = event.x - event.subject.fx;
}

function drag(event) {
  const tmpDate = xScale.invert(event.x);
  const date = new Date(Date.UTC(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()));
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const x = Math.min(Math.max(event.x - differ, 0), w);
  const y = 15;

  cursor.attr('x', event.subject.x = x);
  tips.attr('transform', `translate(${(x - 10)}, ${y})`);
  tips.select('#date-tips').text(`${m < 10 ? ('0' + m) : m}/${d < 10 ? ('0' + d) : d}`);
}

function dragEnd(event) {
  const tmpDate = xScale.invert(event.x);
  const date = new Date(Date.UTC(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()));

  store.commit('mapForTwo/year', date.getFullYear());
  store.commit('mapForTwo/tmpMonth', date.getMonth() + 1);
  store.commit('mapForTwo/day', date.getDate());
}

function initCursor() {
  cursor = svg.append('image')
      .attr('width', 20)
      .attr('height', 20)
      .attr('xlink:href', './src/assets/svg/cursor.svg')

  if(unit.value === 0) {
    const tmpDate = new Date(Date.UTC(year.value, month.value - 1, day.value));
    const x = xScale(tmpDate) - 10;
    cursor.attr('x', x);
    cursor.attr('y', margin.marginBottom);
  }
  else {
    const x = xScale(time.value) - 10;
    cursor.attr('x', x);
    cursor.attr('y', margin.marginBottom);
  }
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

  if(unit.value === 0) {
    const tmpDate = new Date(Date.UTC(year.value, month.value - 1, day.value));
    const x = xScale(tmpDate) - 10;
    const y = 15;
    tips.attr('transform', `translate(${(x - 10)}, ${y})`);
    tips.select('#date-tips').text(`${month.value < 10 ? ('0' + month.value) : month.value}/${day.value < 10 ? ('0' + day.value) : day.value}`);
  }
  else {
    const x = xScale(time.value) - 10;
    const y = 15;
    tips.attr('transform', `translate(${(x - 10)}, ${y})`);
    tips.select('#date-tips').text(`${(time.value < 10 ? ('0' + time.value) : time.value)}:00`);
  }
}

function initAxis() {
  initScale();

  let xAxis;
  if(unit.value === 0) {
    xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%B')).ticks(d3.timeMonth.every(1));
  }
  else {
    xAxis = d3.axisBottom(xScale).tickValues([0, 6, 12, 18, 24]);
  }

  svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${h - margin.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 2))
}

function initScale() {
  if(unit.value === 0) {
    xScale = d3.scaleUtc();
    xScale.domain([new Date(year.value, 0, 1), new Date(year.value, 11, 31)]);
  }
  else {
    xScale = d3.scaleLinear();
    xScale.domain([0, 23]);
  }

  xScale.range([margin.marginLeft, w - margin.marginRight]);
}

function redirect() {
  svg.select('#x-axis').remove();
  initAxis();

  if(unit.value === 0) {
    const tmpDate = new Date(Date.UTC(year.value, month.value - 1, day.value));
    const x = xScale(tmpDate) - 10;
    const y = 15;
    cursor.attr('x', x);
    tips.attr('transform', `translate(${(x - 10)}, ${y})`);
    tips.select('#date-tips').text(`${month.value < 10 ? ('0' + month.value) : month.value}/${day.value < 10 ? ('0' + day.value) : day.value}`);
  }
  else {
    const x = xScale(time.value) - 10;
    const y = 15;
    cursor.attr('x', x);
    tips.attr('transform', `translate(${(x - 10)}, ${y})`);
    tips.select('#date-tips').text(`${(time.value < 10 ? ('0' + time.value) : time.value)}:00`);
  }

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

  watch(() => [store.state['mapForTwo'].day, store.state['mapForTwo'].month, store.state['mapForTwo'].time], (newValues) => {
    time.value = newValues[2];
    month.value = newValues[1];
    day.value = newValues[0];
    redirect();
  })

})

watch(() => unit.value, (newValue) => {
  if(svg != null && unit.value != null) {
    svg.selectAll('*').remove();
    init();
  }
})

</script>

<template>
  <div ref="container" id="line-container">

  </div>

</template>

<style scoped>

#line-container {
  height: 100%;
}

</style>