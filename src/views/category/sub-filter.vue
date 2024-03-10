<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="heade">品牌：&nbsp;&nbsp;</div>
      <div class="body">
        <a href="javascript:;" :class="{ active: filterData.selectedBrand === brand.id }"
          v-for="brand of filterData.brands" :key="brand.id" @click="changeBrand(brand.id)">
          {{ brand.name }}
        </a>
      </div>
    </div>
    <div class="item" v-for="p of filterData.saleProperties">
      <div class="head">{{ p.name }}</div>
      <div class="body">
        <a :class="{ active: p.selectedProp === attr.id }" href="javascript:;" v-for="attr of p.properties.slice(0,10)" :key="attr.id"
          @click="changeAttr(p, attr.id)">
          {{ attr.name }}
        </a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
  </div>
</template>

<script setup lang="js" name="SubFilter">
import { findSubCategoryFilter } from '@/api/category'
import { useRoute } from 'vue-router'
import { nextTick, ref, watch } from 'vue'

// 1. 获取数据
// 2. 数据中需要全部选中，需要预览将来点击激活功能。默认选中全部
// 3. 完成渲染
const route = useRoute()
const filterData = ref(null)
const filterLoading = ref(false)
// 4. 分类发生变化的时候需要重新获取筛选数据，需要使用侦听器
watch(() => route.params.id, (newVal) => {
  // 当从二级分类去顶级分类也会拿到ID，不能去加载数据因为它不是二级分类的ID
  // route.path === ('/category/sub/' + newVal)判断新的路由地址是否为目标地址
  if (newVal && route.path === ('/category/sub/' + newVal)) {
    // console.log('/category/sub/',newVal);
    // console.log(route.path);
    filterLoading.value = true// 数据还没加载完的时候，显示骨架屏
    // 先判断newVal是否存在,再通过findSubCategoryFilter去请求跟路由传参id对应的数据
    newVal && findSubCategoryFilter(route.params.id).then(({ result }) => {
      // 品牌全部
      result.selectedBrand = null// 初始化品牌数据
      result.brands.unshift({ id: null, name: '全部' })// 在数组头部添加一条自定义数据(全部，数组第一条数据默认为全部)
      // 销售属性全部
      result.saleProperties.forEach(p => {
        p.selectedProp = null// 初始化销售属性数据
        p.properties.unshift({ id: null, name: '全部' })// 在头部添加一个name，值为全部，用于默认显示
      })
      filterData.value = result// 将请求结果赋值给filterData
      // console.log(filterData.value.saleProperties);
      filterLoading.value = false// 请求完成后隐藏骨架屏
    })
  }
}, { immediate: true })// 立即执行

const emit = defineEmits(['filter-change'])
// 点击品牌
const changeBrand = (brandId) => {// 当点击品牌时触发，接收被点击那一项的品牌ID
  if (filterData.value.selectedBrand === brandId) return// 判断是否重复点击
  filterData.value.selectedBrand = brandId// 将品牌id赋值
  // console.log(getFilterParams());
  emit('filter-change', getFilterParams())// 触发父组件自定义事件，将getFilterParams()的返回值传递过去
}
// 点击属性
const changeAttr = (p, attrId) => {// 当点击销售属性时触发，接收被点击那一项的销售属性数据和ID
  if (p.selectedProp === attrId) return// 判断是否重复点击
  p.selectedProp = attrId// 将销售属性id赋值
  // console.log(p,attrId);
  emit('filter-change', getFilterParams())
}

// 获取筛选参数
const getFilterParams = () => {
  const filterParams = {}// 初始化筛选参数
  const attrs = []// 初始化销售属性数组
  filterParams.brandId = filterData.value.selectedBrand// 品牌id赋值给filterParams.brandId
  filterData.value.saleProperties.forEach(p => {// 遍历销售属性数组
    // properties为销售属性数组，selectedProp为被点击的销售属性id
    const attr = p.properties.find(attr => attr.id === p.selectedProp)// 在数组中找到被点击的销售属性
    // 当attr为真，并且attr的id不为undefined，说明被点击的销售属性存在，将其添加到attrs数组中
    if (attr && attr.id !== undefined) {
      // groupName为销售属性的分类名称，propertyName为销售属性的属性名称
      // groupName对应一个propertyName，因为同时只有一个销售属性可以被点击,默认是自定义添加到数组头部的“全部”
      // push方法会循环添加，直到每一项key、value都被添加到attrs数组中
      attrs.push({ groupName: p.name, propertyName: attr.name })
    }
  })
  // 当attrs数组中有数据，说明有品牌或销售属性被点击，将attrs数组赋值给filterParams.attrs
  if (attrs.length) filterParams.attrs = attrs
  // console.log(filterParams);
  return filterParams// 将被点击的品牌和销售属性分类名称下被点击的属性名称返回
}
</script>

<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;

  .item {
    display: flex;
    line-height: 40px;

    .head {
      width: 80px;
      color: #999;
    }

    .body {
      flex: 1;

      a {
        margin-right: 30px;
        // margin-left: 36px;
        transition: all .3s;
        display: inline-block;

        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}

.xtx-skeleton {
  padding: 10px 0;
}
</style>