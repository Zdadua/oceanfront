<script setup>

import * as d3 from 'd3';
import {scaleLinear} from "d3";
import {onMounted, ref} from "vue";
import {random} from "mathjs";

const props = defineProps({
  width: {
    type: Number,
    default: 250,
  },
  height: {
    type: Number,
    default: 250,
  }
})

let testSvg = ref();

function paintChart() {
  let width = props.width;
  let height = props.height;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  testSvg.value.setAttribute('width', width);
  testSvg.value.setAttribute('height', height);

  const data = [];

  for(let i = 1; i <= 30; i++) {
    let val = random() * 60 - 20;
    data.push({
      date: i,
      value: val,
    })
  }

  const svg = d3.select('#test-svg');

  const x = scaleLinear(
      [0, 30],
      [marginLeft, width - marginRight]
  );

  const y = scaleLinear(
      [-20, 40],
      [height - marginBottom, marginTop]
  );

  const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

  const xAxis = d3.axisBottom(x).ticks(6).tickSizeOuter(0);
  const yAxis = d3.axisLeft(y).ticks(5).tickSizeOuter(3);

  svg.append('g')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(xAxis);

  svg.append('g')
      .attr('transform', `translate(${marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1));

  svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(data));

}

onMounted(() => {
  paintChart();
})

</script>

<template>

  <div class="d3-chart" :style="{'height': props.height + 'px', 'width': props.width + 'px'}">
    <svg ref="testSvg" id="test-svg"></svg>
  </div>

</template>

<style scoped>

.d3-chart {
  background-color: white;
}

</style>