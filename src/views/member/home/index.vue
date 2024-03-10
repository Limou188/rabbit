<template>
  <div class="member-home">
    <!-- 头部 -->
    <HomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="item of collectGoods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹" src="/member/steps" v-if="goods.length">
      <GoodsItem v-for="item of goods.slice(0, 4)" :key="item.id" :goods="item" />
    </HomePanel>
    <HomePanel title="我的足迹" v-else>
      <div class="box">
        <img src="@/assets/images/none.png" alt="">
      </div>
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>

<script setup name="MemberHome">
import HomeOverview from './components/home-overview.vue'
import HomePanel from './components/home-panel.vue'
import GoodsRelevant from '@/views/goods/components/GoodsRelevant.vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { ref } from 'vue'
import { findCollect } from '@/api'
import { useStepsStore } from '@/stores/modules/steps'


const stepsStore = useStepsStore()
const goods = stepsStore.steps
console.log(goods);
// 调用模拟的接口
const collectGoods = ref([])
findCollect({
  page: 1,
  pageSize: 4
}).then(data => {
  collectGoods.value = data.result.items
})
</script>

<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}

:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>