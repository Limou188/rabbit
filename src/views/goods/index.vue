<template>
  <!-- 商品详情页面布局 -->
  <!-- 防止报错，加载完成goods再显示所有内容 -->
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/' + goods.categories[0].id">
          {{ goods.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/' + goods.categories[1].id">
          {{ goods.categories[1].name }}
        </XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 名字区间组件 -->
          <GoodsName :goods="goods" />
          <!-- 规格组件 -->
          <!-- 每一个按钮拥有selected disabled 类名，做选中和禁用效果 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- v-model跨组件数据绑定,父组件,$event是XtxNumbox组件的自定义事件传参 -->
          <XtxNumbox label="数量" :modelValue="num" @change="num = $event" :max="goods.inventory" :min="1" />
          <!-- 加购按钮 -->
          <XtxButton type="primary" class="buttonCss" @click="insertCart()">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 同类商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs :goods="goods" />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1" />
          <GoodsHot :goodsId="goods.id" :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js" name="XtxGoodsPage">
import GoodsRelevant from '@/views/goods/components/GoodsRelevant.vue'
import GoodsImage from './components/GoodsImage.vue'
import GoodsName from './components/GoodsName.vue'
import GoodsSales from './components/GoodsSales.vue'
import { getCurrentInstance, nextTick, provide, ref, watch } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute, } from 'vue-router'
import GoodsSku from './components/GoodsSku.vue'
import GoodsTabs from './components/GoodsTabs.vue'
import GoodsHot from './components/GoodsHot.vue'
import GoodsWarn from './components/GoodsWarn.vue'
import { useCartStore } from '@/stores/modules/cart'



const useGoods = () => {
  // 出现路由地址，商品id发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    // 路由接收传参时后在路径最后加上传参内容，newVal为传参，判断新地址是否为路由跳转地址
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
        goods.value = null
        // console.log(route.params.id);
        nextTick(() => {// 下一轮执行
          goods.value = data.result
          // console.log(goods);
        })
      })
    }
  }, { immediate: true })
  // console.log(goods);
  return goods
}
const goods = useGoods()
// sku改变时候触发
const changeSku = (sku) => {
  if (sku.skuId) {
    goods.value.price = sku.price
    goods.value.oldPrice = sku.oldPrice
    goods.value.inventory = sku.inventory
    currSku.value = sku
  } else {
    currSku.value = null
  }
}
// 选择的数量
const num = ref(1)
// 加入购物车逻辑
const currSku = ref(null)
const instance = getCurrentInstance()// 获取当前实例
// console.log(instance);
const cartStore = useCartStore()

const insertCart = () => {
  let res = ref(null)
  if (!currSku.value) {
    return instance.proxy.$message({ type: 'warn', text: '请选择商品规格' })// https://blog.csdn.net/hncu1990/article/details/119273475
  }
  if (num.value > goods.inventory) {
    return instance.proxy.$message({ type: 'warn', text: '商品库存不足' })
  }
  // 添加购物车，批量更改属性
  res.value = {
    id: goods.value.id,
    skuId: currSku.value.skuId,
    name: goods.value.name,
    picture: goods.value.mainPictures[0],
    price: currSku.value.price,
    nowPrice: currSku.value.price,
    count: num.value,
    attrsText: currSku.value.specsText,
    selected: true,
    isEffective: true,
    stock: currSku.value.inventory
  }
  if (res.value) {
    cartStore.setCart(res)
  }
  return instance.proxy.$message({ type: 'success', text: '添加购物车成功' })

}
// store.$patch((state) => {
//   state.items.push({ name: 'shoes', quantity: 1 })
//   state.hasChanged = true
// })

const route = useRoute()
// console.log(route.params.id);
// findGoods('1').then(({ result }) => {
//   console.log(result);
// })
// 请求商品详情数据
findGoods(route.params.id).then(({ result }) => {
  // const sortSpecs = []
  // result.skus[0].specs.forEach(spec => {
  //   sortSpecs.push(result.specs.find(item => item.name === spec.name))
  // })
  // result.specs = sortSpecs
  result.skus.forEach(sku => {// 在请求回的数据中循坏遍历，对每一项都执行回调函数，skus选项属性组合集合，spu仓库
    const sortSpecs = []
    // result.specs是可选组合数组，name：颜色，values：黑色/蓝色...
    result.specs.forEach(spec => {// 双重循环，将skus中的12种可选组合拿出来，再将specs中的三种选项属性拿出来

      // sku.specs是选项组合结果数组，name：颜色，valueName：黑色...
      sortSpecs.push(sku.specs.find(item => item.name === spec.name))// 每次将
    })
    sku.specs = sortSpecs
  })
  goods.value = result
})

// 依赖注入,提供数据
provide('goods', goods)

</script>

<style scoped lang='less'>
.buttonCss {
  margin-top: 20px;
  margin-left: 10px;
}
.goods-info {
  min-height: 600px;
  background: #fff;
}

.goods-footer {
  display: flex;
  margin-top: 20px;

  .goods-article {
    width: 940px;
    margin-right: 20px;
  }

  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}

.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;

  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }

  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
</style>