<template>
  <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <template v-slot:right><XtxMore /></template>
    <div style="position: relative;height: 406px;" ref="target">
      <Transition name="fade">
        <ul v-if="goods.length" class="goods-list">
          <li v-for="item in goods" :key="item.id" @click="getSteps(item)">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="">
              <p class="name">{{item.name}}</p>
              <p class="price">&yen;{{item.price}}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton bg="#f0f9f4" v-else />
      </Transition>
    </div>
  </HomePanel>
</template>

<script setup lang="js" name="HomeNew">
import HomePanel from '@/views/home/components/home-panel.vue'
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks'
import HomeSkeleton from './home-skeleton.vue'
import { useStepsStore } from "@/stores/modules/steps"


const { target, result:goods } = useLazyData(findNew)

const stepsStore = useStepsStore()
const getSteps = (item) => {
  stepsStore.setSteps(item)
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }

    .price {
      color: @priceColor;
    }
  }
}
</style>