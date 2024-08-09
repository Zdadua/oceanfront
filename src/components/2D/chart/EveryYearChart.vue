<script setup>

import * as d3 from "d3";

import {computed, onMounted, ref, watch, watchEffect} from "vue";
import {useStore} from "vuex";
import {ceil, floor} from "mathjs";
import {toLonLat} from "ol/proj.js";
import {dateString, fetchWithTimeout} from "../../../js/tools.js";
import LoadingAnimate from "../animate/LoadingAnimate.vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  date: Date,
})

const store = useStore();
const everyContainer = ref();
const display = {
  marginTop: 40,
  marginRight: 30,
  marginBottom: 20,
  marginLeft: 40,
}

let xScale;
let yScale;
let line;
let svg;
let w;
let h;
let tips;

let showDot = computed(() => store.state['popup'].showDot);
let loaded = ref(false);

let rawData = ref();
let data = computed(() => {
  if(rawData.value != null) {
    let res = [];
    for(let i = 0; i < rawData.value.length; i++) {
      res.push({
        year: 1981 + i,
        value: rawData.value[i]
      })
    }

    return res;
  }
})

watchEffect(() => {
  loaded.value = false;
  if(showDot.value != null) {
    if(svg != null) {
      svg.selectAll('*').remove();
    }
    const temp = store.state['mapForTwo'].points.get(showDot.value);
    let [lon, lat] = toLonLat(temp.getCoordinate());

    // fetch数据
    // TODO 目前是直接抹平处理
    const url = `/data/sst_past/${floor(lat)}/${floor(lon)}/${dateString(props.date)}`;
    fetchWithTimeout({url: url, timeout: 10000})
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          loaded.value = true;
          rawData.value = data.column;
          initChart();
        })
        .catch(error => {
          if(error.message === 'timeout') {
            console.log('network request timout!');
          }
          else if(error.message === 'Network response was not ok') {
            loaded.value = true;
            noData();
            console.log('Network response was not ok!');
          }
          else {
            console.error('An error occurred at OverlayChart.vue:', error);
          }
        });
  }
})

function initChart() {
  initAxis();
  initLine();
  initTips();
  setListener();
}

function initAxis() {
  initScale();

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).ticks(6);

  // x轴绘制
  svg.append('g')
      .attr('id', `X${props.id}`)
      .attr('transform', `translate(0, ${h - display.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4));

  // y轴绘制
  svg.append('g')
      .attr('id', `Y${props.id}`)
      .attr('transform', `translate(${display.marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('class', `${props.id}YL`)
          .attr('x2', w - display.marginLeft - display.marginRight)
          .attr('stroke-opacity', 0.1))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.1))

  // y轴单位
  svg.append('text')
      .attr('x', '20px')
      .attr('y', '30px')
      .style('font-size', '.7em')
      .text('C°');
}

function initScale() {
  xScale = d3.scaleLinear().range([display.marginLeft, w - display.marginRight]);
  yScale = d3.scaleLinear().range([h - display.marginBottom, display.marginTop]);

  const xDomain = d3.extent(data.value, d => parseInt(d.year));
  xScale.domain(xDomain);

  const yDomain = d3.extent(data.value, d => parseFloat(d.value));
  yDomain[0] -= 1;
  yDomain[1] += 1;
  yScale.domain(yDomain);
}

function initLine() {
  line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value));

  // 折线绘制(数据部分)
  svg.append('path')
      .attr('id', `L${props.id}`)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1.5)
      .attr('d', line(data.value));
}

function initTips() {
  tips = svg.append('g')
      .attr('id', `T${props.id}`)
      .style('display', 'none')

  tips.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('fill', 'white')
      .attr('rx', 10)
      .attr('ry', 10)
      .style("filter", "drop-shadow(2px 2px 5px rgba(0,0,0,0.5))");

  tips.append('text')
      .attr('id', `D${props.id}`)
      .attr('x', 15)
      .attr('y', 25)
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .style("fill", 'rgb(108,108,108)');

  tips.append('text')
      .attr('id', `TEMP${props.id}`)
      .attr('x', 20)
      .attr('y', 55)
      .text('hhh')
      .style("font-size", "15px")
      .style("font-family", "UNSII, sans-serif")
      .style("fill", "black");

  // 指示线
  svg.append('line')
      .attr('id', `GL${props.id}`)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.2)
      .style('display', 'none');

  svg.append('circle')
      .attr('id', `P${props.id}`)
      .attr('r', 3)
      .attr('fill', 'rgb(255,0,98)')
      .style('display', 'none');
}

function setListener() {
  const listenerPlane = svg.append('rect')
      .attr('class', 'overPlane')
      .attr('width', w - display.marginLeft - display.marginRight)
      .attr('height', h - display.marginTop - display.marginBottom)
      .attr('x', display.marginLeft)
      .attr('y', display.marginTop)
      .attr('opacity', 0);

  listenerPlane.on('mouseover', () => {
    svg.select(`#GL${props.id}`)
        .style('display', null);

    svg.select(`#T${props.id}`)
        .style('display', null);

    svg.select(`#P${props.id}`)
        .style('display', null);
  });

  listenerPlane.on('mouseout', () => {
    svg.select(`#GL${props.id}`)
        .style('display', 'none');

    svg.select(`#T${props.id}`)
        .style('display', 'none');

    svg.select(`#P${props.id}`)
        .style('display', 'none');
  });

  listenerPlane.on('mousemove', (event) => {
    const currentX = xScale.invert(event.offsetX);
    const d0 = xScale(floor(currentX));
    const d1 = xScale(ceil(currentX));
    const offset = event.offsetX - d0 < d1 - event.offsetX ? d0 : d1;

    const currentData = data.value.find(d => d.year === xScale.invert(offset));
    if(currentData) {
      svg.select(`#GL${props.id}`)
          .attr('x1', offset)
          .attr('x2', offset)
          .attr('y1', display.marginTop)
          .attr('y2', h - display.marginBottom);

      tips.select(`#D${props.id}`)
          .text(currentData.year);

      tips.select(`#TEMP${props.id}`)
          .text('海表温度: ' + currentData.value);

      svg.select('circle')
          .attr('cx', offset)
          .attr('cy', yScale(currentData.value));

      let tipWidth = 140;
      let tipHeight = 80;
      let gap = 10;
      let x, y;
      if(event.offsetY - gap - tipHeight > display.marginTop) {
        y = event.offsetY - gap - tipHeight;
      }
      else {
        y = display.marginTop;
      }

      if(event.offsetX + tipWidth + gap < w - display.marginRight) {
        x = event.offsetX + gap;
      }
      else {
        x = event.offsetX - tipWidth - gap;
      }

      tips.transition()
          .ease(d3.easeSinOut)
          .delay(50)
          .duration(100)
          .attr('transform', `translate(${x}, ${y})`);
    }
  });

}

function noData() {
  svg.append('text')
      .attr('x', w / 2 - 48)
      .attr('y', h / 2 + 20)
      .attr('fill', 'rgb(0, 0, 0)')
      .style('font-size', '1.5em')
      .style('font-weight', '900')
      .text('暂无数据')

  svg.append('image')
      .attr('x', w / 2 - 30)
      .attr('y', h / 2 - 70)
      .attr('width', 60)
      .attr('height', 60)
      .attr('xlink:href', '/static/svg/warning.svg')
}


function createNode() {
  svg = d3.create('svg');
  svg.attr('width', w);
  svg.attr('height', h);
}


onMounted(() => {
  w = everyContainer.value.offsetWidth;
  h = everyContainer.value.offsetHeight;

  createNode();
  everyContainer.value.appendChild(svg.node());
})

</script>

<template>

  <div ref="everyContainer" class="every-chart-container">
    <div v-if="!loaded" style="height: 100%; width: 100%; display: grid; place-items: center">
      <LoadingAnimate></LoadingAnimate>
    </div>
  </div>

</template>

<style scoped>

.every-chart-container {
  width: 100%;
  height: 100%;
}

</style>