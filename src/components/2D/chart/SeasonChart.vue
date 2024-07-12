<script setup>

import {nextTick, onMounted, ref, watch} from "vue";
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
  svg.selectAll('*').remove();
  initChart();
})

let xScale;
let yScale;
let line;
let svg;
let w;
let h;
let zoom = 4;
const gap = [7, 22, 45, 90];
function initChart() {
  // let height = h - display.marginTop - display.marginBottom;

  const year = store.state['mapForTwo'].year;
  xScale.domain([new Date(year, 0, 1), new Date(year, 11, 31)])
  if(props.data) {
    let extent = d3.extent(props.data, d => d.value);
    extent[0] -= 1;
    extent[1] += 1;
    yScale.domain(extent);
  }
  else {
    yScale.domain([0, 40]);
  }

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));
  const yAxis = d3.axisLeft(yScale).ticks(8);

  line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

  // x轴绘制
  svg.append('g')
      .attr('id', `${props.title}X`)
      .attr('transform', `translate(0, ${h - display.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4))

  // y轴绘制
  svg.append('g')
      .attr('id', `${props.title}Y`)
      .attr('transform', `translate(${display.marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('class', `${props.title}YL`)
          .attr('x2', w - display.marginLeft - display.marginRight)
          .attr('stroke-opacity', 0.1))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.1))

  // 折线绘制(数据部分)
  svg.append('path')
      .attr('id', `${props.title}L`)
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

  // 指示线
  svg.append('line')
      .attr('id', `${props.title}GL`)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.2)
      .style('display', 'none');

  // 用于监听事件
  svg.append('rect')
      .attr('class', 'overPlane')
      .attr('width', w - display.marginLeft - display.marginRight)
      .attr('height', h - display.marginTop - display.marginBottom)
      .attr('x', display.marginLeft)
      .attr('y', display.marginTop)
      .attr('opacity', 0)
      .on('mouseover', () => {
        svg.select(`#${props.title}GL`)
            .style('display', null)
      })
      .on('mouseout', () => {
        svg.select(`#${props.title}GL`)
            .style('display', 'none')
      })
      .on('mousemove', (event) => {
        const currentX = xScale.invert(event.offsetX);
        const tmpDate = new Date(currentX.getFullYear(), currentX.getMonth(), currentX.getDate());
        const d0 = xScale(tmpDate);
        tmpDate.setDate(tmpDate.getDate() + 1);
        const d1 = xScale(tmpDate);
        const offset = event.offsetX - d0 < d1 - event.offsetX ? d0 : d1;


        const currentData = props.data.find(d => d.date.getTime() == xScale.invert(offset).getTime());
        if(currentData) {
          svg.select(`#${props.title}GL`)
              .attr('x1', offset)
              .attr('x2', offset)
              .attr('y1', display.marginTop)
              .attr('y2', h - display.marginBottom);
        }
      })
      .on('wheel', (event) => {
        event.preventDefault();
        if(event.deltaY < 0 && zoom > 0) {
          zoom--;
          drawAxis(event.offsetX, zoom);
        }
        else if(event.deltaY > 0 && zoom < 4) {
          zoom++;
          drawAxis(event.offsetX, zoom);
        }
      })
}

function drawAxis(offsetX, z) {
  const newDomain = [];
  if(z == 4) {
    newDomain.push(new Date(store.state['mapForTwo'].year, 0, 1));
    newDomain.push(new Date(store.state['mapForTwo'].year, 11, 31));
  }
  else {
    const date = xScale.invert(offsetX);
    const center = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const preferLeft = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const preferRight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    preferLeft.setDate(center.getDate() - gap[z]);
    preferRight.setDate(center.getDate() + gap[z]);

    const minDate = new Date(store.state['mapForTwo'].year, 0, 1);
    const maxDate = new Date(store.state['mapForTwo'].year, 11, 31);

    if(preferLeft.getTime() < minDate.getTime()) {
      newDomain.push(minDate);
      const rightDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      rightDate.setDate(rightDate.getDate() + gap[z] * 2);
      newDomain.push(rightDate);
    }
    else if(preferRight.getTime() > maxDate.getTime()) {
      const leftDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      leftDate.setDate(leftDate.getDate() - gap[z] * 2);
      newDomain.push(leftDate);
      newDomain.push(maxDate);
    }
    else {
      newDomain.push(preferLeft);
      newDomain.push(preferRight);
    }
  }

  xScale.domain(newDomain);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));

  svg.select(`#${props.title}X`)
      .transition()
      .duration(500)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4));


  let subData = props.data.filter((d) => {
    return d.date.getTime() >= newDomain[0].getTime() && d.date.getTime() <= newDomain[1].getTime();
  })
  const yNewDomain = d3.extent(subData, d => d.value);
  yNewDomain[0] -= 1;
  yNewDomain[1] += 1;
  yScale.domain(yNewDomain);
  console.log(newDomain);
  const yAxis = d3.axisLeft(yScale).ticks(8);

  svg.select(`#${props.title}Y`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll(`.${props.title}YL`).remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('class', `${props.title}YL`)
          .attr('x2', w - display.marginLeft - display.marginRight)
          .attr('stroke-opacity', 0.1))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.1))

  line.x(d => xScale(d.date))
      .y(d => yScale(d.value));

  svg.select(`#${props.title}L`)
      .transition()
      .duration(500)
      .attr('d', line(props.data));

}

onMounted(() => {
  nextTick(() => {
    w = seasonContainer.value.offsetWidth;
    h = seasonContainer.value.offsetHeight;
    xScale = d3.scaleTime().range([display.marginLeft, w - display.marginRight]);
    yScale = d3.scaleLinear().range([h - display.marginBottom, display.marginTop]);

    svg = d3.create('svg');
    svg.attr('id', props.title);
    svg.attr('width', w);
    svg.attr('height', h);
    seasonContainer.value.appendChild(svg.node());
    initChart();
  })
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