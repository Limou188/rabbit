<template>
  <div class="home-banner">
    <XtxCarousel auto-play :sliders="sliders">
      <!-- <div v-if="id != null " ></div> -->
    </XtxCarousel>
  </div>
</template>

<script setup lang="js" name="HomeBanner">
import { findBanner } from '@/api/home';
import { ref } from 'vue';
import { emitter } from '@/utils/mitt'


let id = ref()
emitter.on('dim', (categoryId) => {
  id.value = categoryId
})

// 异步请求
// async function getBanner() {
//   const data = await findBanner()
//   sliders.value = data.result
//   return sliders
// }
// getBanner()
const sliders = ref([])
findBanner().then(data => {
  sliders.value = data.result
})
</script>

<style scoped lang="less">
.xtx-carousel {
  :deep(.carousel-btn.prev) {
    left: 270px;
  }

  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}

.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
</style>