<template>
  <div class="header">
    <HomeOverview />
  </div>
  <HomePanel title="我的足迹" :lookAll="false" v-if="stepsStore.steps.length">
    <div class="box">
      <ul class="goods-list">
        <li v-for="item of stepsStore.steps" :key="item.id">
          <GoodsItem :goods="item" />
        </li>
      </ul>
    </div>
  </HomePanel>
  <HomePanel title="我的足迹" :lookAll="false" v-else>
    <div class="box">
      <img src="@/assets/images/none.png" alt="">
    </div>
  </HomePanel>
  <GoodsRelevant />
</template>

<script lang="js" setup name="HomeSteps">
import HomeOverview from './home-overview.vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
import HomePanel from './home-panel.vue'
import { useStepsStore } from '@/stores/modules/steps'
import GoodsRelevant from '@/views/goods/components/GoodsRelevant.vue'


const stepsStore = useStepsStore()

</script>

<style lang="less" scoped>
.box {
  height: auto;
  display: flex;
  background-color: #fff;

  img {
    margin: 0 auto;
    height: 280px;
  }
}

.goods-list {
  width: 960px;
  display: flex;
  flex-wrap: wrap;

  li {
    width: 240px;
    height: 300px;
    margin-bottom: 10px;

    // &:nth-last-child(-n+4) {
    //   margin-bottom: 0;
    // }

    // &:nth-child(4n) {
    //   margin-right: 0;
    // }
  }
}
</style>