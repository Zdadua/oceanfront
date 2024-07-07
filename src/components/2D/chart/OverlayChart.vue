<script setup>

import {nextTick, onMounted, ref} from "vue";
import * as d3 from 'd3';
import {ceil, floor} from "mathjs";

const props = defineProps({
  data: Array,
  width: Number,
  height: Number,
  options: {
    type: Object,
    default: {
      marginTop: 30,
      marginRight: 10,
      marginBottom: 20,
      marginLeft: 25,
    }
  },
  title: {
    type: String,
    required: true
  }
})

let container = ref();

function initChart() {

  const svg = d3.create('svg');
  svg.attr('width', props.width);
  svg.attr('height', props.height);

  let height = props.height - props.options.marginTop - props.options.marginBottom;

  const xScale = d3.scaleLinear([1, 15], [props.options.marginLeft, props.width - props.options.marginRight]);
  const yScale = d3.scaleLinear(d3.extent(props.data, d => d), [props.height - props.options.marginBottom, props.options.marginTop]);

  const xAxis = d3.axisBottom(xScale).ticks(8).tickValues([1, 3, 5, 7, 9, 11, 13, 15]);
  const yAxis = d3.axisLeft(yScale).ticks(5);

  const line = d3.line()
      .x((d, i) => xScale(i + 1))
      .y(d => yScale(d));

  svg.append('g')
      .attr('transform', `translate(0, ${props.height - props.options.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('troke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4))

  svg.append('g')
      .attr('transform', `translate(${props.options.marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('x2', props.width - props.options.marginLeft - props.options.marginRight)
          .attr('stroke-opacity', 0.1))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.1))

  svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(props.data));

  svg.append('text')
      .attr('x', '15px')
      .attr('fill', 'rgb(96,96,96)')
      .style('font-weight', '900')
      .attr('dy', '.8em')
      .text(props.title)

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
      .attr('width', props.width - props.options.marginLeft - props.options.marginRight)
      .attr('height', props.height - props.options.marginTop - props.options.marginBottom)
      .attr('x', props.options.marginLeft)
      .attr('y', props.options.marginTop)
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
            .attr('y1', -yScale(props.data[d]) + props.options.marginTop)
            .attr('y2', height - yScale(props.data[d]) + props.options.marginTop)
      })

  return svg.node();
}

onMounted(() => {
  container.value.appendChild(initChart());
})

</script>

<template>

  <div ref="container" class="overlay-chart-container" :style="{'height': props.height + 'px', 'width': props.width + 'px'}">
  </div>

</template>

<style scoped>

</style>