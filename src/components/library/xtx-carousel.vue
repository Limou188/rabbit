<template>
  <div class='xtx-carousel' @mouseenter="stop()" @mouseleave="start()">
    <ul class="carousel-body">
      <li class="carousel-item" v-for="(item,i) in props.sliders" :key="i" :class="{fade:index===i}"> 
        <!-- 广告轮播图 -->
        <RouterLink v-if="item.hrefUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <!-- 商品轮播图 -->
        <div v-else class="slider">
          <RouterLink v-for="goods of item" :key="goods.id" :to="`/product/${goods.id}`" @click="getSteps(goods)">
          <!-- <RouterLink v-for="goods of item" :key="goods.id" :to="`/product`"> -->
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"><i class="iconfont icon-angle-left"></i></a>
    <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span v-for="(item,i) in props.sliders" :key="i" :class="{active:index===i}" @click="toggles(i)"></span>
    </div>
  </div>
</template>

<script setup lang="js" name="XtxCarousel">
import { onUnmounted, ref, watch } from 'vue'
import { useStepsStore } from '@/stores/modules/steps'

// 使用轮播图效果需要加 auto-play <XtxCarousel auto-play :sliders="sliders" />
const props = defineProps({
  sliders: {
    type: Array,
    default: () => []
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
})

// 默认显示的图片的索引
const index = ref(0)
// 自动播放
let timer = null
const autoPlayFn = () => {
  clearInterval(timer)
  timer = setInterval(() => {
    index.value++
    if (index.value >= props.sliders.length) {
      index.value = 0
    }
  }, props.duration)
}
watch(() => props.sliders, (newVal) => {
  // 有数据&&开启自动播放，才调用自动播放函数
  if (newVal.length && props.autoPlay) {
    index.value = 0
    autoPlayFn()
  }
}, {immediate:true})

// 鼠标进入停止，移出开启自动，前提条件：autoPlay为true
const stop = () => {
  if (timer) clearInterval(timer)
}
const start = () => {
  if (props.sliders.length && props.autoPlay) {
    autoPlayFn()
  }
}
// 左右箭头指示器切换
const toggle = (step) => {
  const newIndex = index.value + step
  if (newIndex >= props.sliders.length) {
    index.value = 0
    return
  }
  if (newIndex < 0) {
    index.value = props.sliders.length - 1
    return
  }
  index.value = newIndex
}
// 图片下方的指示器切换
const toggles = (step) => {
  const newIndex =  step
  index.value = newIndex
}
// 组件卸载，清理定时器
onUnmounted(() => {
  clearInterval(timer)
})

// 我的足迹
const stepsStore = useStepsStore()
const getSteps = (goods) => {
  stepsStore.setSteps(goods)
}
</script>

<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  // margin-right: -80px ;
  // float: right;
  // z-index: 99;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }

    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;

      &.fade {
        opacity: 1;
        z-index: 1;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        // position: relative;
        // right: 15%;

        ~span {
          margin-left: 12px;
        }

        &.active {
          background: #fff;
        }
      }
    }

    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, .2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }

      &.next {
        right: 20px;
      }
    }
  }

  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    &:hover {
      background-color: #fff - 15;
  }
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>