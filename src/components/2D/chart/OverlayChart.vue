<script setup>

import {computed, nextTick, onMounted, ref, watch, watchEffect} from "vue";
import * as d3 from 'd3';
import {ceil, floor} from "mathjs";
import {useStore} from "vuex";
import {toLonLat} from "ol/proj.js";
import { fetchWithTimeout } from "../../../js/tools.js";
import LoadingAnimate from "../animate/LoadingAnimate.vue";
import {extent} from "d3";

const store = useStore();
const props = defineProps({
  coordinate: Array,
  data: Array,
  options: {
    type: Object,
    default: {
      marginTop: 30,
      marginRight: 15,
      marginBottom: 30,
      marginLeft: 35,
    }
  },
  title: {
    type: String,
    required: true
  },
  id: {
    required: true
  },
})

let date = computed(() => {
  const year = store.state['mapForTwo'].year;
  const month = store.state['mapForTwo'].month;
  const day = store.state['mapForTwo'].day;

  return new Date(Date.UTC(year, month - 1, day));
});
// 是否获取到数据
let loaded = ref(false);
let rawData = ref();
let data = computed(() => {
  if(rawData.value != null) {
    let res = [];

    for(let i = -7; i <= 7; i++) {
      let tmpDate = new Date(date.value);
      tmpDate.setDate(tmpDate.getDate() + i);
      res.push({
        date: tmpDate,
        value: rawData.value[i + 7]
      })
    }
    return res;
  }

  return null;
})

watchEffect(() => {
  let [lon, lat] = toLonLat(props.coordinate);
  lon = floor(lon);
  lat = floor(lat);

  let dateString = date.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replaceAll('/', '-');

  const url = `/data/sst_15/${lat}/${lon}/${dateString}`;

  fetchWithTimeout({url: url, timeout: 10000})
      .then(response => {
        if(!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      })
      .then(data => {
        loaded.value = true;

        rawData.value = data.row;
        console.log(data.row);
        if(rawData.value[0] == null) {
          noData();
        }
        else {
          svg.selectAll('*').remove();
          initChart();
        }
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
})

let overlayContainer = ref();
let xScale;
let yScale;
let svg;
let w = 290;
let h = 230;


function initChart() {
  initAxis();
  initLine();

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

  const x = xScale(data.value[7].date);
  const todayLine = svg.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.3)
      .attr('y1', props.options.marginTop)
      .attr('y2', h - props.options.marginBottom)
      .attr('x1', x)
      .attr('x2', x)

  const todayCircle = svg.append('circle')
      .attr('r', 3)
      .attr('fill', 'rgb(65,204,0)')
      .attr('cx', x)
      .attr('cy', yScale(data.value[7].value))



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

  tips.append('text')
      .attr('id', `Pre${props.id}`)
      .attr('x', 20)
      .attr('y', 35)
      .style("font-size", "8px")
      .style("font-family", "sans-serif")
      .style("fill", 'rgb(41,181,39)')
      .style('display', 'none')
      .text('**以下为预测内容**');

  svg.append('rect')
      .attr('class', 'overPlane')
      .attr('width', w - props.options.marginLeft - props.options.marginRight)
      .attr('height', h - props.options.marginTop - props.options.marginBottom)
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

        const firstDate = new Date(Date.UTC(currentX.getFullYear(), currentX.getMonth(), currentX.getDate()));
        const d0 = xScale(firstDate);
        const secondDate = new Date(firstDate);
        secondDate.setDate(firstDate.getDate() + 1);
        const d1 = xScale(secondDate);
        const [offset, chosenDate] = event.offsetX - d0 <= d1 - event.offsetX ? [d0, firstDate] : [d1, secondDate];

        const currentData = data.value.find(d => d.date.getTime() === chosenDate.getTime());
        if (currentData) {
          guideLine.attr('x1', offset)
              .attr('x2', offset)
              .attr('y1', props.options.marginTop)
              .attr('y2', h - props.options.marginBottom);

          let dateString = currentData.date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          tips.select(`#OD${props.id}`)
              .text(dateString);

          tips.select(`#OTEMP${props.id}`)
              .text('海表温度: ' + currentData.value);

          if(currentData.date > store.state['mapForTwo'].lastDate) {
            tips.select(`#Pre${props.id}`)
                .style('display', null);
          }
          else {
            tips.select(`#Pre${props.id}`)
                .style('display', 'none');
          }

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

          if (event.offsetX + tipWidth + gap < w - props.options.marginRight) {
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

function initScale() {
  xScale = d3.scaleUtc().range([props.options.marginLeft, w - props.options.marginRight]);
  yScale = d3.scaleLinear().range([h - props.options.marginBottom, props.options.marginTop]);

  const first = data.value[0].date;
  const f = new Date(Date.UTC(first.getFullYear(), first.getMonth(), first.getDate()));
  const second = data.value[14].date;
  const s = new Date(Date.UTC(second.getFullYear(), second.getMonth(), second.getDate()));

  const xDomain = [f, s];
  xScale.domain(xDomain);

  const yDomain = extent(data.value, d => parseFloat(d.value));
  yDomain[0] -= .5;
  yDomain[1] += .5;
  yScale.domain(yDomain);

}

function initAxis() {
  initScale();

  let timeFormat = d3.utcFormat("%m-%d");
  const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
    return timeFormat(d);
  }).ticks(d3.utcDay.every(2));
  // 其他刻度保持原样
  const yAxis = d3.axisLeft(yScale).ticks(6);

  svg.append('g')
      .attr('transform', `translate(0, ${h - props.options.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4))

  svg.append('g')
      .attr('transform', `translate(${props.options.marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('x2', w - props.options.marginLeft - props.options.marginRight)
          .attr('stroke-opacity', 0.1))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.1))
}

function initLine() {
  const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

  let tmp = new Date(date.value);
  tmp.setDate(tmp.getDate() - 7);
  const f = new Date(tmp);
  tmp.setDate(tmp.getDate() + 14);
  const s = new Date(tmp);

  const last = store.state['mapForTwo'].lastDate;
  if(f < last && s > last) {
    const history = data.value.filter(d => d.date <= last);
    const predict = data.value.filter(d => d.date >= last);

    svg.append('path')
        .datum(history)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

    svg.append('path')
        .datum(predict)
        .attr('fill', 'none')
        .attr('stroke', 'rgb(64,255,0)')
        .attr('stroke-width', 1.5)
        .attr('d', line);

  }
  else {
    svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line(data.value));
  }


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
      .attr('xlink:href', './src/assets/svg/warning.svg')
}

function createNode() {
  svg = d3.create('svg');
  svg.attr('width', w);
  svg.attr('height', h);
}

onMounted(() => {
  nextTick(() => {
    createNode();
    overlayContainer.value.appendChild(svg.node());
  })
})

</script>

<template>

  <div ref="overlayContainer" class="overlay-chart-container">
    <div v-if="!loaded" style="height: 100%; width: 100%; display: grid; place-items: center">
      <LoadingAnimate></LoadingAnimate>
    </div>
  </div>

</template>

<style scoped>

.overlay-chart-container {
  width: 100%;
  height: 100%;
}

</style>