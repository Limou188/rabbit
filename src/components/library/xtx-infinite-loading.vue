<template>
  <div class="xtx-infinite-loading" ref="container">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">加载中...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">傻逼，别划了</span>
    </div>
  </div>
</template>

<script setup lang="js" name="XtxInfiniteLoading">
import { useIntersectionObserver } from '@vueuse/core';
import { ref } from 'vue';
import { defineEmits, defineProps } from 'vue'


const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  finished: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['infinite'])

const container = ref(null)
useIntersectionObserver(
  container,
  ([{ isIntersecting }], dom) => {
    if (isIntersecting) {
      if (props.loading === false && props.finished === false) {
        emit('infinite')
      }
    }
  },
  {
    threshold: 0
  }
)
</script>

<style scoped lang='less'>
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;;
    .img {
      width: 50px;
      height: 50px;
      // background: url(@/src/assets/images/200.png) no-repeat;
    }

    .text {
      color: #999;
      font-size: 16px;
    }
  }

  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;

    .img {
      width: 200px;
      height: 134px;
      // background: url(@/src/assets/images/xyzw.gif) no-repeat center / contain;
    }

    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>