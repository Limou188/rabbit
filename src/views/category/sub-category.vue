<template>
  <div class='sub-category' ref="scrollContainer">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread v-if="!search"/>
      <!-- 筛选区（品牌和销售属性） -->
      <subFilter @filter-change="changeFilter" v-if="!search" />
      <!-- 结果区 -->
      <div class="goods-list">
        <!-- 排序（价格和人气等） -->
        <SubSolt @sort-change="changeSort" />
        <!-- 列表 -->
        <ul v-if="goodsList.length > 0">
          <li v-for="item of goodsList" :key="item.id">
            <!-- 二级分类下的goods，父转子，父组件 -->
            <GoodsItem :goods="item" />
          </li>
        </ul>
        <ul v-else>
          <li>
            <!-- 二级分类下的goods，父转子，父组件 -->
            <GoodsItem />
          </li>
        </ul>
        <!-- 无限加载功能， -->
        <XtxIndiniteLoading :loading="loading" :finished="finished" @infinite="getData" v-if="!search" />
      </div>
    </div>
  </div>
</template>

<script setup lang="js" name="SubCategory">
import SubBread from './sub-bread.vue'
import subFilter from './sub-filter.vue'
import SubSolt from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { onUpdated, ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
import XtxIndiniteLoading from '@/components/library/xtx-infinite-loading.vue'
import { findGoods } from '@/api/product'
import { useScattered } from '@/stores/modules/scattered'





// 1. 基础布局
// 2. 无限加载组件
// 3. 动态加载数据且渲染
// 4. 任何筛选条件变化需要更新列表
const route = useRoute()
const loading = ref(false)
const finished = ref(false)
const goodsList = ref([])
// 请求的传参
let reqParams = {
  page: 1,
  pageSize: 20
}
// 这里的route.params.id是二级分类的id
// 获取数据
const getData = () => {
  loading.value = true // loading.value 为true页面显示加载中
  reqParams.categoryId = route.params.id// 将接收的二级分类id赋值给请求参数
  // console.log(reqParams)
  findSubCategoryGoods(reqParams).then(({ result }) => {// 将请求结果打包成对象
    if (result.items.length) {// 如果result.items.length为true，说明数据已经请求回来了
      // 通过push将请求结果添加到goodsList数组后面,并且通过...result.items将结果展开为单独key：value形式
      goodsList.value.push(...result.items)
      // console.log(goodsList.value[0].price);
      reqParams.page++
    } else {
      // 如果result.items.length为false,说明没有新数据可以加载了，为true，页面显示已经到底了
      finished.value = true
    }
    // loading.value 为false，页面取消显示加载中
    loading.value = false
  })
}

// 切换二级分类重新加载,watch监听路由传过来的id属性
watch(() => route.params.id, (newVal) => {// newVal为新的id
  // 如果newVal不为空，并且当前路由路径为二级分类的路径，则重新加载数据
  // 路由接收id时也会把id对应的值加在路径后面，所以需要在二级分类路径后面加上新的id值
  if (newVal && route.path === ('/category/sub/' + newVal)) {
    goodsList.value = []// 清空数组
    reqParams = {// 重置请求参数
      page: 1,
      pageSize: 20,
    }
    finished.value = false
  }
})

// 监听筛选区改变，接收筛选区传过来的参数（重新加载页面）
const changeFilter = (filterParams) => {// filterParams为被点击的品牌id、销售属性分类名和属性名
  // 将筛选区传过来的参数展开赋值给reqParams
  reqParams = { ...reqParams, ...filterParams }

  reqParams.page = 1// 重置页码
  goodsList.value = []// 重置商品数组
  finished.value = false// 重置是否已经到底了(关闭显示加载完成)
}
// 监听排序改变
const changeSort = (sortParams) => {
  // console.log(sortParams);
  reqParams = { ...reqParams, ...sortParams }
  // console.log(reqParams.sortParams);
  reqParams.value = 1
  goodsList.value = []
  finished.value = false
}

// 控制销售属性组件和无线加载组件是否显示
let search = false
// 搜索框传参
// 将路由传参ids按照逗号分割成数组
const indexs = route.params.id.split(',')
if (route.params.id && indexs[indexs.length - 1] === 'search') {
  search = true
  for (let i = 0; i < indexs.length - 1; i++) {
    findGoods(indexs[i]).then(({ result }) => {
      // result身上没有picture图片路径属性所以将mainPictures[0]赋值给picture
      result.search = true
      result.picture = result.mainPictures[0]
      // 将每一次加工后的请求结果推入goodsList数组
      goodsList.value.push(result)
    })
  }
}
// watch(route.params.id,() => {
//   console.log('001');
// })
// console.log(indexs);
// if (route.params.id && typeof route.params.id === 'object' && !Array.isArray(route.params.id)) {
//   // id 存在且是对象（但不是数组）
// }
// console.log(goodsList);

const scattered = useScattered()
// 将组件实例给搜索框组件，以实现一键到顶/底部功能
const scrollContainer = ref(null)
onUpdated(() => {
  // 给搜索框组件提供scrollContainerRef，以实现一键到顶/底部功能
  scattered.setScrollHeight(scrollContainer.value.scrollHeight)
})
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;

    li {
      margin-right: 20px;
      margin-bottom: 20px;

      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>