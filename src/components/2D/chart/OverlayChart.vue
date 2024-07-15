<script setup>

import {computed, nextTick, onMounted, ref, watch} from "vue";
import * as d3 from 'd3';
import {ceil, floor} from "mathjs";
import {useStore} from "vuex";

const store = useStore();
const props = defineProps({
  data: Array,
  width: Number,
  height: Number,
  options: {
    type: Object,
    default: {
      marginTop: 30,
      marginRight: 15,
      marginBottom: 30,
      marginLeft: 30,
    }
  },
  title: {
    type: String,
    required: true
  },
  id: {
    required: true
  },
  domain: {
    type: Array,
    required: true
  }
})

let container = ref();

let showDay = computed(() => {
  const year = store.state['mapForTwo'].year;
  const month = store.state['mapForTwo'].month;
  const day = store.state['mapForTwo'].day;

  return new Date(year, month - 1, day);
})

let xScale;
let yScale;
let svg;

watch(() => props.data, () => {
  svg.selectAll('*').remove();
  initChart();
})


function initChart() {

  xScale.domain(props.domain);

  let extent = [0, 40];
  if(props.data) {
    extent = d3.extent(props.data, d => d.value);
    extent[0] -= 1;
    extent[1] += 1;
  }
  yScale.domain(extent);

  let timeFormat = d3.timeFormat("%m-%d");
  const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat((d, i) => {

    return timeFormat(d);
  });
  // 其他刻度保持原样
  const yAxis = d3.axisLeft(yScale).ticks(6);

  const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

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

  // 指示线
  const guideLine = svg.append('line')
      .attr('id', `OGL${props.id}`)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.2)
      .style('display', 'none');

  const guideCircle = svg.append('circle')
      .attr('id', `OP${props.id}`)
      .attr('r', 3)
      .attr('fill', 'rgb(255,0,98)')
      .style('display', 'none');

  const x = xScale(props.data[7].date);
  const todayLine = svg.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.3)
      .attr('y1', props.options.marginTop)
      .attr('y2', props.height - props.options.marginBottom)
      .attr('x1', x)
      .attr('x2', x)

  const todayCircle = svg.append('circle')
      .attr('r', 3)
      .attr('fill', 'rgb(65,204,0)')
      .attr('cx', x)
      .attr('cy', yScale(props.data[7].value))

  const todayText = svg.append('text')
      .attr('x', x - 14)
      .attr('y', props.options.marginTop)
      .style('font-size', '.8em')
      .style('fill', 'rgb(182,182,182)')
      .text('今天');



  const tips = svg.append('g')
      .attr('id', `OT${props.id}`)
      .style('display', 'none')

  tips.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('fill', 'white')
      .attr('rx', 10)
      .attr('ry', 10)
      .style("filter", "drop-shadow(2px 2px 5px rgba(0,0,0,0.5))");

  tips.append('text')
      .attr('id', `OD${props.id}`)
      .attr('x', 15)
      .attr('y', 25)
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .style("fill", 'rgb(108,108,108)');

  tips.append('text')
      .attr('id', `OTEMP${props.id}`)
      .attr('x', 20)
      .attr('y', 55)
      .text('hhh')
      .style("font-size", "15px")
      .style("font-family", "UNSII, sans-serif")
      .style("fill", "black");

  svg.append('rect')
      .attr('class', 'overPlane')
      .attr('width', props.width - props.options.marginLeft - props.options.marginRight)
      .attr('height', props.height - props.options.marginTop - props.options.marginBottom)
      .attr('x', props.options.marginLeft)
      .attr('y', props.options.marginTop)
      .attr('opacity', 0)
      .on('mouseover', () => {
        tips.style('display', null);
        guideLine.style('display', null);
        guideCircle.style('display', null);
      })
      .on('mouseout', () => {
        tips.style('display', 'none');
        guideLine.style('display', 'none');
        guideCircle.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const currentX = xScale.invert(event.offsetX);
        const tmpDate = new Date(currentX.getFullYear(), currentX.getMonth(), currentX.getDate());
        const d0 = xScale(tmpDate);
        tmpDate.setDate(tmpDate.getDate() + 1);
        const d1 = xScale(tmpDate);
        const offset = event.offsetX - d0 < d1 - event.offsetX ? d0 : d1;


        const currentData = props.data.find(d => d.date.getTime() == xScale.invert(offset).getTime());
        if (currentData) {
          guideLine.attr('x1', offset)
              .attr('x2', offset)
              .attr('y1', props.options.marginTop)
              .attr('y2', props.height - props.options.marginBottom);

          let dateString = currentData.date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          tips.select(`#OD${props.id}`)
              .text(dateString);

          tips.select(`#OTEMP${props.id}`)
              .text('海表温度: ' + currentData.value);

          svg.select('circle')
              .attr('cx', offset)
              .attr('cy', yScale(currentData.value));

          let tipWidth = 140;
          let tipHeight = 80;
          let gap = 10;
          let x, y;
          if (event.offsetY - gap - tipHeight > props.options.marginTop) {
            y = event.offsetY - gap - tipHeight;
          } else {
            y = props.options.marginTop;
          }

          if (event.offsetX + tipWidth + gap < props.width - props.options.marginRight) {
            x = event.offsetX + gap;
          } else {
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

onMounted(() => {
  nextTick(() => {
    xScale = d3.scaleTime().range([props.options.marginLeft, props.width - props.options.marginRight]);
    yScale = d3.scaleLinear().range([props.height - props.options.marginBottom, props.options.marginTop]);

    svg = d3.create('svg');
    svg.attr('id', props.id);
    svg.attr('width', props.width);
    svg.attr('height', props.height);
    container.value.appendChild(svg.node());
    initChart();
  })
})

</script>

<template>

  <div ref="container" class="overlay-chart-container" :style="{'height': props.height + 'px', 'width': props.width + 'px'}">
  </div>

</template>

<style scoped>

</style>