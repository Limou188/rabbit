<template>
  <div class="order-detail-page" v-if="order">
  <!-- 操作栏 -->
    <DetailAction :order="order" />
     <!-- 步骤条 全局组件xtx-steps.vue-->
     <DetailSteps :order="order" />
    <!-- 物流栏 -->
    <!-- 如果order.orderState中包含3,4,5,则显示物流信息 -->
    <Suspense v-if="[3,4,5].includes(order.orderState)">
      <!-- 组件加载完毕 -->
      <DetailLogistics :order="order" @close="display=false"/>
    </Suspense>
    <!-- 组件加载中显示 -->
    <div class="loading" v-show="display">加载中...</div>
    <!-- 订单商品信息 -->
    <OrderInfo :order="order"/>
  </div>
</template>

<script setup name="OrderDetailPage">
import DetailAction from './detail-action.vue'
import { findOrderDetail } from '@/api/order'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import DetailSteps from './detail-steps.vue'
import DetailLogistics from './detail-logistics.vue'
import OrderInfo from './order-info.vue'



// 初始化占位等待条显示
const display = ref(true)
// 查看详情
const order = ref(null)
const route = useRoute()
// const findOrderDetailFn = () => {
  findOrderDetail(route.params.id).then(data => {
    order.value = data.result
  })
// }
</script>

<style scoped lang="less">
.loading{
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
.order-detail-page {
  background: #fff;
}
</style>