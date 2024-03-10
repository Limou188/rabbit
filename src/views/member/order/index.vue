<template>
  <div class="member-order-page">
    <!-- tabs组件,头部列表 -->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel v-for="item of orderStatus" :key="item.name" :label="item.label" :name="item.name">
        <!-- {{ item.label }} -->
      </XtxTabsPanel>
    </XtxTabs>
    <!-- 商品订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div v-if="!loading && orderList.length === 0" class="none">暂无数据</div>
      <OrderItem 
        v-if="!loading" 
        v-for="item of orderList" 
        :key="item.id" :order="item" 
        @on-cancel-order="onCancelOrder(item)" 
        @on-delete-order="onDeleteOrder(item)"
        @on-confirm-order="onConfirmOrder(item)"
        @on-logistics-order="onLogisticsOrder(item)"
      />
    </div>
  </div>
  <!-- 取消订单对话框 -->
  <!-- <Teleport to="#dailog"> -->
    <OrderCancel ref="orderCancelCom" />
    <OrderLogistics ref="logisticsOrderCom"/>
  <!-- </Teleport> -->
</template>

<script setup name="MemberOrder">
import { ref, watch, reactive } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import OrderCancel from './components/order-cancel.vue'
import { deleteOrder, findOrderList, confirmOrder } from '@/api/order'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics.vue'



const activeName = ref('all')

// 查询订单参数
const requestParams = reactive({
  page: 1,
  pageSize: 5,
  orderState: 0
})
// 此时的tab.index就是订单的状态
const tabClick = (tab) => {
  requestParams.orderState = tab.index
  requestParams.page = 1
}

const orderList = ref([])
const total = ref(0)
const loading = ref(true)
// 查询订单函数
const findCollectFn = () => {
  loading.value = true
  findOrderList(requestParams).then(data => {
    orderList.value = data.result.items
    total.value = data.result.counts
    loading.value = false
  })
}
// 初始化后，查询条件更改后，查询
watch(requestParams, () => {
  findCollectFn()
}, { immediate: true })

// 取消订单函数
// const useCancelOrder = () => {
  const orderCancelCom = ref(null)
  const onCancelOrder = (item) => {
    // item就是要取消的订单
    orderCancelCom.value.open(item)
  }
// }
// 删除订单函数
const onDeleteOrder = (item) => {
  Confirm({text:'您确认删除订单吗?'}).then(()=>{
    deleteOrder([item.id]).then(()=>{
      Message({text:'删除订单成功',type:'success'})
      findCollectFn()
    })
  }).catch(()=>{})
}
// 确认收货函数
// const useConfirmOrder = () => {
  const onConfirmOrder = (item) => {
    console.log(item);
    // item为订单数据
    Confirm({text:'您确认收货吗？确认后货款将打给卖家。'}).then(()=>{
      confirmOrder(item.id).then(()=>{
        Message({text:'确认收货成功',type:'success'})
        // 确认收货后状态变成待评价
        item.orderState = 4
      })
    })
  }
// }
// 查看物流函数
// const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const onLogisticsOrder = (item) => {
    logisticsOrderCom.value.open(item)
  }
// }

// 单独暴露组件上的方法
defineExpose({
  onConfirmOrder,
})
</script>

<style scoped lang="less">
.order-list {
  // padding: 20px;
  position: relative;
}

.loading {
  height: 500px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, .9) url(../../../assets/images/load.gif) no-repeat center;
  box-sizing: 9999;
}

.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>