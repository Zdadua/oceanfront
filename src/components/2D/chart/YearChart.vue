<script setup>

import {computed, nextTick, onMounted, ref, watch, watchEffect} from "vue";
import * as d3 from "d3";
import store from "../../../store/index.js";
import {floor} from "mathjs";
import {dateString, fetchWithTimeout} from "../../../js/tools.js";
import {toLonLat} from "ol/proj";
import LoadingAnimate from "../animate/LoadingAnimate.vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  date: Date,
})

let seasonContainer = ref();
let display = {
  marginTop: 40,
  marginRight: 30,
  marginBottom: 20,
  marginLeft: 40,
}

let showDot = computed(() => store.state['popup'].showDot);
let loaded = ref(false);

let rawData = ref();
let data = computed(() => {
  if(rawData.value != null) {
    let res = [];
    let startDate = new Date(props.date.getFullYear(), 0, 1);

    for(let i = 0; i < rawData.value.length; i++) {
      let tmpDate = new Date(startDate);
      tmpDate.setDate(startDate.getDate() + i);
      res.push({
        date: tmpDate,
        value: rawData.value[i]
      })
    }
    return res;
  }
  return null;
})

let rawMeanData = ref();
let meanData = computed(() => {
  if(rawMeanData.value != null) {
    let res = [];
    let startDate = new Date(props.date.getFullYear(), 0, 1);

    for(let i = 0; i < rawData.value.length; i++) {
      let tmpDate = new Date(startDate);
      tmpDate.setDate(startDate.getDate() + i);
      res.push({
        date: tmpDate,
        value: rawMeanData.value[i]
      })
    }
    return res;
  }
  return null;
})

let xScale;
let yScale;
let line;
let svg;
let w;
let h;
let zoom = 4;
const gap = [7, 22, 45, 90];

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
    const url = `/data/sst_recent/${floor(lat)}/${floor(lon)}/${dateString(props.date)}`;
    const meanUrl = `/data/sst_mean/${floor(lat)}/${floor(lon)}`;

    const fetchData = fetchWithTimeout({url: url, timeout: 10000})
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          rawData.value = data.row.map(value => parseFloat(value));
        })
        .catch(error => {
          if(error.message === 'timeout') {
            console.log('network request timout!');
          }
          else if(error.message === 'Network response was not ok') {
            console.log('Network response was not ok!');
          }
          else {
            console.error('An error occurred at OverlayChart.vue:', error);
          }
        });

    const fetchMeanData = fetchWithTimeout({url: meanUrl, timeout: 10000})
        .then(response => {
          if(!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          rawMeanData.value = data.column;
        })
        .catch(error => {
          if(error.message === 'timeout') {
            console.log('network request timout!');
          }
          else if(error.message === 'Network response was not ok') {
            console.log('Network response was not ok!');
          }
          else {
            console.error('An error occurred at OverlayChart.vue:', error);
          }
        });

    Promise.all([fetchData, fetchMeanData])
      .then(() => {
        loaded.value = true;
        initChart();
      })
      .catch(error => {
        loaded.value = true;
        noData();
      })
  }
})


function initChart() {
  initAxis();
  initLine();

  // 指示线
  svg.append('line')
      .attr('id', `${props.id}GL`)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.2)
      .style('display', 'none');

  svg.append('circle')
      .attr('id', `${props.id}P`)
      .attr('r', 3)
      .attr('fill', 'rgb(255,0,98)')
      .style('display', 'none');

  const tips = svg.append('g')
      .attr('id', `${props.id}T`)
      .style('display', 'none')

  tips.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('fill', 'white')
      .attr('rx', 10)
      .attr('ry', 10)
      .style("filter", "drop-shadow(2px 2px 5px rgba(0,0,0,0.5))");

  tips.append('text')
      .attr('id', `${props.id}D`)
      .attr('x', 15)
      .attr('y', 25)
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .style("fill", 'rgb(108,108,108)');

  tips.append('text')
      .attr('id', `${props.id}TEMP`)
      .attr('x', 20)
      .attr('y', 50)
      .style("font-size", "15px")
      .style("font-family", "UNSII, sans-serif")
      .style("fill", "black");

  tips.append('text')
      .attr('id', `${props.id}MEAN`)
      .attr('x', 20)
      .attr('y', 70)
      .style("font-size", "15px")
      .style("font-family", "UNSII, sans-serif")
      .style("fill", "black");


  // 用于监听事件
  svg.append('rect')
      .attr('class', 'overPlane')
      .attr('width', w - display.marginLeft - display.marginRight)
      .attr('height', h - display.marginTop - display.marginBottom)
      .attr('x', display.marginLeft)
      .attr('y', display.marginTop)
      .attr('opacity', 0)
      .on('mouseover', () => {
        svg.select(`#${props.id}GL`)
            .style('display', null);

        svg.select(`#${props.id}T`)
            .style('display', null);

        svg.select(`#${props.id}P`)
            .style('display', null);
      })
      .on('mouseout', () => {
        svg.select(`#${props.id}GL`)
            .style('display', 'none');

        svg.select(`#${props.id}T`)
            .style('display', 'none');

        svg.select(`#${props.id}P`)
            .style('display', 'none');
      })
      .on('mousemove', (event) => {
        const currentX = xScale.invert(event.offsetX);

        const firstDate = new Date(currentX.getFullYear(), currentX.getMonth(), currentX.getDate());
        const d0 = xScale(firstDate);
        const secondDate = new Date(firstDate);
        secondDate.setDate(firstDate.getDate() + 1);
        const d1 = xScale(secondDate);
        const [offset, chosenDate] = event.offsetX - d0 <= d1 - event.offsetX ? [d0, firstDate] : [d1, secondDate];


        const currentData = data.value.find(d => d.date.getTime() === chosenDate.getTime());
        const meanCurrentData = meanData.value.find(d => d.date.getTime() === chosenDate.getTime());

        if(currentData != null && currentData.value != null) {
          svg.select(`#${props.id}GL`)
              .style('display', null);

          svg.select(`#${props.id}T`)
              .style('display', null);

          svg.select(`#${props.id}P`)
              .style('display', null);

          svg.select(`#${props.id}GL`)
              .attr('x1', offset)
              .attr('x2', offset)
              .attr('y1', display.marginTop)
              .attr('y2', h - display.marginBottom);

          let dateString = currentData.date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          tips.select(`#${props.id}D`)
              .text(dateString);

          tips.select(`#${props.id}TEMP`)
              .text('海表温度: ' + currentData.value);

          tips.select(`#${props.id}MEAN`)
              .text('平均温度: ' + meanCurrentData.value);

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
        else {
          svg.select(`#${props.id}GL`)
              .style('display', 'none');

          svg.select(`#${props.id}T`)
              .style('display', 'none');

          svg.select(`#${props.id}P`)
              .style('display', 'none');
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

  initLegend();
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

  svg.select(`#${props.id}X`)
      .transition()
      .duration(500)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4));


  let subData = data.value.filter((d) => {
    return d.date.getTime() >= newDomain[0].getTime() && d.date.getTime() <= newDomain[1].getTime();
  })
  const yNewDomain = d3.extent(subData, d => d.value);
  yNewDomain[0] -= 1;
  yNewDomain[1] += 1;
  yScale.domain(yNewDomain);
  const yAxis = d3.axisLeft(yScale).ticks(8);

  svg.select(`#${props.id}Y`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll(`.${props.id}YL`).remove())
      .call(g => g.selectAll('.tick line').clone()
          .attr('class', `${props.id}YL`)
          .attr('x2', w - display.marginLeft - display.marginRight)
          .attr('stroke-opacity', 0.1))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.1))

  line.x(d => xScale(d.date))
      .y(d => yScale(d.value));

  svg.select(`#${props.id}L`)
      .transition()
      .duration(500)
      .attr('d', line(data.value));

  svg.select(`#${props.id}M`)
      .transition()
      .duration(500)
      .attr('d', line(meanData.value));

}

function initAxis() {
  initScale();

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));
  const yAxis = d3.axisLeft(yScale).ticks(8);

  line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

  // x轴绘制
  svg.append('g')
      .attr('id', `${props.id}X`)
      .attr('transform', `translate(0, ${h - display.marginBottom})`)
      .call(xAxis)
      .call(g => g.select('.domain')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 2))
      .call(g => g.selectAll('.tick line')
          .attr('stroke-opacity', 0.4))

  // y轴绘制
  svg.append('g')
      .attr('id', `${props.id}Y`)
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
  xScale = d3.scaleTime().range([display.marginLeft, w - display.marginRight]);
  yScale = d3.scaleLinear().range([h - display.marginBottom, display.marginTop]);

  const year = store.state['mapForTwo'].year;
  xScale.domain([new Date(year, 0, 1), new Date(year, 11, 31)]);

  let extent = [0, 40];

  if(rawData.value && rawMeanData.value) {
    let extentD = d3.extent(rawData.value);
    let extentM = d3.extent(rawMeanData.value);

    extent[0] = extentD[0] < extentM[0] ? extentD[0] : extentM[0];
    extent[1] = extentD[1] > extentM[1] ? extentD[1] : extentM[1];
    extent[0] -= 1;
    extent[1] += 1;
  }
  yScale.domain(extent);
}

function initLine() {
  const defs = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'myGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

  defs.selectAll('stop')
      .data([
        {offset: '0%', color: 'red'},
        {offset: '100%', color: 'blue'}
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)

  // 折线绘制(数据部分)
  svg.append('path')
      .attr('id', `${props.id}L`)
      .attr('fill', 'none')
      .attr('stroke', 'url(#myGradient)')
      .attr('stroke-width', 1.5)
      .attr('d', line(data.value));

  svg.append('path')
      .attr('id', `${props.id}M`)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(250,134,1)')
      .attr('stroke-width', 1.5)
      .attr('d', line(meanData.value));
}

// TODO 历史平均的legend添加
function initLegend() {
  const legendWrapper = svg.append('g')
      .attr('width', 200)
      .attr('height', 20)
      .attr('transform', `translate(${(w - 200)}, 10)`);

  legendWrapper.append('rect')
      .attr('width', 20)
      .attr('height', 15)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'url(#myGradient)');

  legendWrapper.append('text')
      .attr('x', 25)
      .attr('y', 11)
      .attr('fill', 'rgb(133,133,133)')
      .style('font-size', '.7em')
      .text('今年')

  legendWrapper.append('rect')
      .attr('width', 20)
      .attr('height', 15)
      .attr('x', 100)
      .attr('y', 0)
      .attr('fill', 'rgb(250,134,1)');

  legendWrapper.append('text')
      .attr('x', 125)
      .attr('y', 11)
      .attr('fill', 'rgb(133,133,133)')
      .style('font-size', '.7em')
      .text('年均')
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
  svg.attr('id', props.id);
  svg.attr('width', w);
  svg.attr('height', h);
}

onMounted(() => {
  nextTick(() => {
    w = seasonContainer.value.offsetWidth;
    h = seasonContainer.value.offsetHeight;

    createNode();
    seasonContainer.value.appendChild(svg.node());
  })
})

</script>

<template>
  <div ref="seasonContainer" class="season-chart-container">
    <div v-if="!loaded" style="height: 100%; width: 100%; display: grid; place-items: center">
      <LoadingAnimate></LoadingAnimate>
    </div>
  </div>

</template>

<style scoped>

.season-chart-container {
  width: 100%;
  height: 100%;
}
</style>