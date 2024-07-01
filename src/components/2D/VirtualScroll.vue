<script setup>

import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";

let list = ref();

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
  }
})

let start = ref(0);
let startOffset = ref(0);
let end = ref(0);
let store = useStore();

let visibleCount = computed(() => Math.ceil(props.sightHeight / props.itemHeight) + 1);
let listHeight = computed(() => props.items.length * props.itemHeight);
let getTransform = computed(() => `translateY(${startOffset.value}px)`);
let visibleData = computed(() => props.items.slice(start.value, Math.min(end.value, props.items.length)));


const scrollEvent = (e) => {
  let scrollTop = list.value.scrollTop;
  start.value = Math.floor(scrollTop / props.itemHeight);
  end.value = start.value + visibleCount.value;
  startOffset.value = scrollTop - (scrollTop % props.itemHeight);
}

onMounted(() => {
  if(list.value) {
    end.value = start.value + visibleCount.value;
  }

})
</script>

<template>

  <div ref="list" id="virtual-scroll-container" @scroll="scrollEvent" :style="{'height': `${props.sightHeight}px`, 'width': `${props.sightWidth}px`}">
    <div class="virtual-scroll-phantom" :style="{'height': `${listHeight}px`, 'width': `${props.sightWidth}px`}">
    </div>

    <div class="see-sight"  :style="{'transform': getTransform, 'width': `${props.sightWidth}px`}">
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
  scrollbar-width: none;
  scroll-snap-type: y mandatory;
  mask: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 0) 100%);
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

  scroll-snap-align: center;
}

.see-sight {
  height: 100%;
  position: absolute;
}

</style>