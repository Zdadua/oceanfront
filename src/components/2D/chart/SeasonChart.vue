<script setup>

import {onMounted, ref, watch} from "vue";
import * as d3 from "d3";
import {ceil, floor} from "mathjs";
import store from "../../../store/index.js";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
  },
})

let seasonContainer = ref();
let display = {
  marginTop: 30,
  marginRight: 30,
  marginBottom: 20,
  marginLeft: 40,
}

watch(() => props.data, () => {
  const svg = d3.select(`#${props.title}`)
  svg.selectAll('*').remove();
  initChart();
});

function initChart() {
  let w = seasonContainer.value.offsetWidth;
  let h = seasonContainer.value.offsetHeight;
  let height = h - display.marginTop - display.marginBottom;

  const svg = d3.select(`#${props.title}`);

  const year = store.state['mapForTwo'].year;
  const xScale = d3.scaleUtc([new Date(year, 0, 1), new Date(year, 11, 1)], [display.marginLeft, w - display.marginRight]);

  let yScale = d3.scaleLinear().range([h - display.marginBottom, display.marginTop]);
  if(props.data) {
    let extent = d3.extent(props.data, d => d.value);
    extent[0] -= 5;
    extent[1] += 5;
    yScale.domain(extent);
  }
  else {
    yScale.domain([0, 40]);
  }

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).ticks(5);

  const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

  // x轴绘制
  svg.append('g')
      .attr('transform', `translate(0, ${h - display.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4))

  // y轴绘制
  svg.append('g')
      .attr('transform', `translate(${display.marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('x2', w - display.marginLeft - display.marginRight)
          .attr('stroke-opacity', 0.1))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.1))

  // 折线绘制(数据部分)
  svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(props.data));

  // 表格标题
  svg.append('text')
      .attr('x', '15px')
      .attr('y', '5px')
      .attr('fill', 'rgb(96,96,96)')
      .style('font-weight', '900')
      .attr('dy', '.8em')
      .text(props.title)

  // 跟随鼠标的tips
  let tip = svg.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

  tip.append('circle')
      .attr('r', 3);

  tip.append('text')
      .attr('x', 9)
      .attr('dy', '.4em')

  tip.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.2);

  svg.append('rect')
      .attr('class', 'overPlane')
      .attr('width', w - display.marginLeft - display.marginRight)
      .attr('height', h - display.marginTop - display.marginBottom)
      .attr('x', display.marginLeft)
      .attr('y', display.marginTop)
      .attr('opacity', 0)
      .on('mouseover', () => {
        tip.style('display', null);
      })
      .on('mouseout', () => {
        tip.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const currentX = xScale.invert(event.offsetX);
        const x0 = floor(currentX);
        const x1 = ceil(currentX);
        let d = currentX - x0 < x1 - currentX ? x0 : x1;
        d--;
        tip.attr('transform', `translate(${xScale(d + 1)}, ${yScale(props.data[d])})`);
        tip.select('text').text(`${props.data[d]}°c`);
        tip.select('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', -yScale(props.data[d]) + display.marginTop)
            .attr('y2', height - yScale(props.data[d]) + display.marginTop)
      })
}

onMounted(() => {
  let w = seasonContainer.value.offsetWidth;
  let h = seasonContainer.value.offsetHeight;

  const svg = d3.create('svg');
  svg.attr('id', props.title);
  svg.attr('width', w);
  svg.attr('height', h);

  seasonContainer.value.appendChild(svg.node());
})

</script>

<template>

  <div ref="seasonContainer" class="season-chart-container">

  </div>

</template>

<style scoped>

.season-chart-container {
  width: 100%;
  height: 100%;
}

</style>