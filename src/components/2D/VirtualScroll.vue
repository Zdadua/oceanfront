<script setup>

import {computed, nextTick, onMounted, ref} from "vue";
import {useStore} from "vuex";

let list = ref();
let sight = ref();

let props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  itemHeight: {
    type: Number,
    default: 30
  },
  sightHeight: {
    type: Number,
    default: 200
  },
  sightWidth: {
    type: Number,
    default: 100
  },
  name: {
    type: String,
    required: true
  },
  initPlace: {
    type: Number,
    default: 0
  }
})

let start = ref(0);
let startOffset = ref(0);
let end = ref(0);
let store = useStore();
let showItems = ref([]);

let visibleCount = computed(() => Math.ceil(props.sightHeight / props.itemHeight) + 1);
let listHeight = computed(() => showItems.value.length * props.itemHeight);
let getTransform = computed(() => `translateY(${startOffset.value}px)`);
let visibleData = computed(() => showItems.value.slice(start.value, Math.min(end.value, showItems.value.length)));


let timeId = null;
let isProgrammaticScroll = false;
const scrollEvent = (e) => {
  if(!isProgrammaticScroll) {
    sight.value.style.transition = 'none';
    if(timeId) {
      clearTimeout(timeId);
      timeId = null;
    }
    timeId = setTimeout(() => {
      sight.value.style.transition = 'transform 0.3s ease-in-out';

      let tmp = list.value.scrollTop % props.itemHeight;
      if(tmp < props.itemHeight / 2) {
        startOffset.value = startOffset.value + tmp;

        store.commit('mapForTwo/' + props.name, visibleData.value.at(visibleCount.value / 2 - 1));
      }
      else {
        startOffset.value = startOffset.value - (props.itemHeight - tmp);

        store.commit('mapForTwo/' + props.name, visibleData.value.at(visibleCount.value / 2));
      }
    }, 100);

    let scrollTop = list.value.scrollTop;
    start.value = Math.floor(scrollTop / props.itemHeight);
    end.value = start.value + visibleCount.value;
    startOffset.value = scrollTop - (scrollTop % props.itemHeight);

  }
}

let initialY = 0;
let initialScrollTop = 0;
const mousedownEvent = (e) => {
  sight.value.style.transition = 'none';
  initialY = e.clientY;
  initialScrollTop = list.value.scrollTop;
  isProgrammaticScroll = true;

  window.addEventListener('mousemove', mousemoveEvent);
  window.addEventListener('mouseup', mouseupEvent);
}

const mousemoveEvent = (e) => {
  const deltaY = e.clientY - initialY;
  list.value.scrollTop = initialScrollTop - deltaY;

  let scrollTop = list.value.scrollTop;
  start.value = Math.floor(scrollTop / props.itemHeight);
  end.value = start.value + visibleCount.value;
  startOffset.value = scrollTop - (scrollTop % props.itemHeight);

}

const mouseupEvent = (e) => {
  sight.value.style.transition = 'transform 0.3s ease-in-out';

  let tmp = list.value.scrollTop % props.itemHeight;
  if(tmp < props.itemHeight / 2) {
    startOffset.value = startOffset.value + tmp;

    store.commit('mapForTwo/' + props.name, visibleData.value.at(visibleCount.value / 2 - 1));
  }
  else {
    startOffset.value = startOffset.value - (props.itemHeight - tmp);

    store.commit('mapForTwo/' + props.name, visibleData.value.at(visibleCount.value / 2));
  }

  window.removeEventListener('mousemove', mousemoveEvent);
  window.removeEventListener('mouseup', mouseupEvent);
  isProgrammaticScroll = false;
}

function throttle(func, limit) {
  let inThrottle = false;
  return (event) => {
    if (!inThrottle) {
      func(event);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const throttleScroll = throttle(scrollEvent, 50);

onMounted(() => {
  if(list.value) {
    showItems.value = ['', ...props.items, ''];
    end.value = start.value + visibleCount.value;

  }

  nextTick(() => {
    list.value.scrollTop = props.initPlace * props.itemHeight;
  })

})
</script>

<template>

  <div ref="list" id="virtual-scroll-container" @mousedown="mousedownEvent" @scroll="throttleScroll" :style="{'height': `${props.sightHeight}px`, 'width': `${props.sightWidth}px`}">
    <div class="virtual-scroll-phantom" :style="{'height': `${listHeight}px`, 'width': `${props.sightWidth}px`}">
    </div>

    <div ref="sight" class="see-sight"  :style="{'transform': getTransform, 'width': `${props.sightWidth}px`}">
      <div v-for="item in visibleData" class="see-sight-item" :style="{'height': `${props.itemHeight}px`}">
        {{ item }}
      </div>
    </div>


  </div>

</template>

<style scoped>

#virtual-scroll-container {
  position: relative;
  overflow: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}

.virtual-scroll-phantom {
  top: 0;
  left: 0;
  position: absolute;
}

.see-sight-item {
  line-height: 30px;
  width: 100%;
  text-align: center;
  color: black;
  user-select: none;

}

.see-sight {
  height: 100%;
  position: absolute;
}

</style>