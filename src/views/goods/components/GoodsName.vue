<template>
  <!-- 销量人气、商品评价 -->
  <p class="g-name">{{ goods.name }}</p>
  <p class="g-desc">{{ goods.desc }}</p>
  <p class="g-price">
    <span>{{ goods.price }}</span>
    <span>{{ goods.oldPrice }}</span>
  </p>
  <div class="g-service">
    <dl>
      <dt>促销</dt>
      <dd>12月好物放送，App领券购买直降120元</dd>
    </dl>
    <dl>
      <dt>配送</dt>
      <dd>至 </dd>
      <XtxCity :fullLocation="fullLocation" @change="changeCity"/>
    </dl>
    <dl>
      <dt>服务</dt>
      <dd>
        <span>无忧退货</span>
        <span>快速退款</span>
        <span>免费包邮</span>
        <a href="javascript:;">了解详情</a>
      </dd>
    </dl>
  </div>
</template>

<script setup name="GoodsName">
import {ref} from 'vue'

const props = defineProps({
  goods:{
    type:Object,
    default:() => {}
  }
})
console.log(props);
const provinceCode = ref('')// 初始化省份
const cityCode = ref('')// 初始化城市
const countyCode = ref('')// 初始化县
const fullLocation = ref('')// 初始化完整地址

// console.log(props.goods);
// 有默认地址的情况
if(props.goods.userAddresses){// 接收的用户初始地址
  const defaultAddr = props.goods.userAddresses.find(addr => addr.isDefault === 1 )
  if(defaultAddr){// defaultAddr为true代表用户有初始地址，将接收的默认地址省市县，和完整地址赋值给对应的地址变量
    provinceCode.value = defaultAddr.provinceCode
    cityCode.value = defaultAddr.cityCode
    countyCode.value = defaultAddr.countyCode
    fullLocation.value = defaultAddr.fullLocation
  }
}

const changeCity = (changeResult) => {// changeResult,city组件将用户选择的地址数据传给父组件
  provinceCode.value = changeResult.provinceCode
  cityCode.value = changeResult.cityCode
  countyCode.value = changeResult.countyCode
  fullLocation.value = changeResult.fullLocation
}
</script>

<style lang="less" scoped>
.g-name {
  font-size: 22px
}

.g-desc {
  color: #999;
  margin-top: 10px;
}

.g-price {
  margin-top: 10px;

  span {
    &::before {
      content: "¥";
      font-size: 14px;
    }

    &:first-child {
      color: @priceColor;
      margin-right: 10px;
      font-size: 22px;
    }

    &:last-child {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
    }
  }
}

.g-service {
  background: #f5f5f5;
  width: 500px;
  padding: 20px 10px 0 10px;
  margin-top: 10px;

  dl {
    padding-bottom: 20px;
    display: flex;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      color: #666;

      &:last-child {
        span {
          margin-right: 10px;

          &::before {
            content: "•";
            color: @xtxColor;
            margin-right: 2px;
          }
        }

        a {
          color: @xtxColor;
        }
      }
    }
  }
}</style>
