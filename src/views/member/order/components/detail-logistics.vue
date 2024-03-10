<template>
  <div class="detail-logistics" v-if="logistics">
    <p>
      <span>{{ logistics.list[0].time }}</span>
      <span>{{ logistics.list[0].text }}</span>
    </p>
    <a href="javascript:;" @click="UseLogisticsOrder">查看物流</a>
  </div>
  <!-- 查看物流组件 -->
  <OrderLogistics ref="logisticsOrderCom" />
</template>

<script setup name="DetailLogistics">
import { ref } from 'vue'
import { logisticsOrder } from '@/api/order'
import OrderLogistics from './order-logistics.vue'

const props = defineProps({
  order:{
    type:Object,
    default:() => {}
  }
})  
// console.log(props.order);
const logistics = ref(null)
// 模拟加载时间
const sleep = () => new Promise((resolve,reject)=>{
  setTimeout(() => {
    resolve()
  },1000)
})
await sleep()
const data = await logisticsOrder(props.order.id)
logistics.value = data.result

// 查看物流信息
const logisticsOrderCom = ref(null)
const UseLogisticsOrder = () => {
  logisticsOrderCom.value.open(props.order)
}

// 关闭父组件等待条
const emit = defineEmits(['close'])
emit('close')
</script>

<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>