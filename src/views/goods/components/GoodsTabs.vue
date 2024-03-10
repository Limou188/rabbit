<template>
  <div class="goods-tabs">
    <!-- 头部标签 -->
    <nav>
      <a 
        :class="{active:activeName === 'detail'}" 
        href="javascript:;"
        @click="clickTab('detail')"
        >商品详情</a>
      <a href="javascript:;" 
        :class="{active:activeName === 'comment'}" 
        @click="clickTab('comment')"
        >商品评价
        <!-- <span>{{ goods.commentCount }}</span> -->
      </a>
    </nav>
    <!-- 切换内容的地方 -->
    <GoodsDetail v-if="activeName == 'detail'" />
    <GoodsComment v-if="activeName == 'comment'" :goods="goods"/>
  </div>
</template>


<script setup name="GoodsTabs">
import { inject, ref } from 'vue'
import GoodsDetail from './GoodsDetail.vue'
import GoodsComment from './GoodsComment.vue'


//依赖注入，接收数据
const goods = inject('goods')
// console.log(goods.value.id);

// detail详情组件，comment评价组件,默认显示详情组件
const activeName = ref('detail')
const clickTab = (name) => {
  activeName.value = name
}
</script>

<style scoped lang="less">
.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }

      &:first-child {
        border-right: 1px solid #f5f5f5;
      }

      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>