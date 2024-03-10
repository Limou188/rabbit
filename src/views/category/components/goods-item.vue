<template>
  <div class="target">
    <!-- 二级面包屑 -->
    <!-- 接收别的组件传递过来的goods数据并渲染,props,父传子，子组件 -->
    <RouterLink :to="`/product/${props.goods.id}`" class="goods-item" v-if="props.goods" @click="getSteps(goods)">
      <img :src="props.goods.picture" alt="" />
      <p class="name ellipsis">{{ props.goods.name }}</p>
      <p class="desc ellipsis">{{ props.goods.desc }}</p>
      <p class="price">&yen;{{ props.goods.price }}</p>
    </RouterLink>
    <div class="none" v-if="!props.goods">
      <p>没有找到搜索物品</p>
      <!-- <img src="@/assets/images/none.png" alt="" height="200" /> -->
    </div>
  </div>
</template>

<script setup lang="js" name="GoodsItem">
import { useStepsStore } from '@/stores/modules/steps'

const props = defineProps({
  goods: {
    type: Object,
    default: () => { }
  }
})

// 我的足迹
const stepsStore = useStepsStore()
const getSteps = (goods) => {
  stepsStore.setSteps(goods)
}
</script>

<style scoped lang='less'>
.none {
  // align-items: center;  // 垂直居中
  // justify-content: center;// 水平居中
    height: 40px;
    position: relative;
    top: 10px;
    left: 475px;
    font-size: 18px;
    color: #8e8c8c;
}

.goods-item {
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
  .hoverShadow();

  img {
    width: 160px;
    height: 160px;
  }

  p {
    padding-top: 10px;
  }

  .name {
    font-size: 16px;
  }

  .desc {
    color: #999;
    height: 29px;
  }

  .price {
    color: @priceColor;
    font-size: 20px;
  }
}
</style>