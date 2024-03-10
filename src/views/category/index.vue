<template>
  <div class="top-category">
    <div class="container">
      <!-- 一级分类下的面包屑导航栏 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="TopCategory.id">{{ TopCategory.name }}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- // 轮播图 -->
      <XtxCarousel :sliders="sliders" auto-play style="height: 500px;" />
      <!-- // 所有二级分类 -->
      <!-- 一级分类下的,（页面）二级分类，渲染在轮播图下面 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="items of TopCategory.children" :key="items.id">
            <RouterLink :to="`/category/sub/${items.id}`">
              <img :src="items.picture" >
              <p>{{ items.name }}</p>
            </RouterLink>
          </li>
        </ul>
        <RouterView></RouterView>
      </div>
      <!-- // 分类物品 -->
      <!-- 一级分类下的goods（页面） -->
      <div class="ref-goods" v-for="item of subList" :key="item.id">
        <div class="head">
          <h3>{{ item.name }}</h3>
          <p class="tag">{{ item.desc }}</p>
          <XtxMore />
        </div>
        <div class="body">
          <!-- 将subList下的goods传递给GoodsItem，props父传子,父组件 -->
          <GoodsItem v-for="g of item.goods" :key="g.id" :goods="g" />
        </div>
      </div>
    </div>
  </div>
  <!-- <subBread /> -->
</template>

<script setup lang="js" name="TopCategory">
import { findBanner } from '@/api/home';
import { useCategoryStore } from '@/stores/modules/category'
import { useRoute, RouterLink } from 'vue-router';
import { computed, ref, watch } from 'vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { findTopCategory } from '@/api/category'

// 获取轮播图数据
const sliders = ref([])
findBanner().then(data => {
  sliders.value = data.result
})

// 面包屑和所有分类
// 获得分类列表数据
const useCategory = useCategoryStore()
const route = useRoute()
// console.log(route.path)
const TopCategory = computed(() => {
  let cate = {}
  // 找到顶级分类列表和路由传参id相等的那一项，赋值给idData
  const idData = useCategory.list.find(item => {// item为需要找到的项
    // console.log(route.params.id);
    // 当item.id===route.params.id时，即返回对应的那一项
    return item.id === route.params.id // route.params接收的是app-headeer-nav.vue传递过来的数据
  })
  // 如果data为真，则说明在useCategory.list找到了目标项
  if (idData) cate = idData
  // console.log(cate.children);
  return cate
})

// 这里的route.params接收的是一级分类的id
// 推荐商品
const subList = ref([])
const getSubList = () =>{
  // 在findTopCategory(route.params.id)方法中请求跟route.params.id对应的数据,跟.find方法类似
  findTopCategory(route.params.id).then(data => {
    // console.log(data.result)
    // 请求的结果赋值给subList
    // console.log(subList);
    // console.log(route.params.id);
    subList.value = data.result.children
  })
}
// findTopCategory(1011000).then((data)=>{
//   console.log(data.result);
// })
// 监听ID变化，重新获取分类列表
watch(() => route.params.id, (newVal) => {// route.params接收的是app-headeer-nav.vue传递过来的数据
  // 首先判断newVal是否存在，然后判断当前的route.path是否为"/category/${newVal}"，
  // 如果相等则调用getSubList()函数。 `/category/${newVal}` === route.path是为了防止newVal为错误id时也触发回调函数
  // 例如去二级分类页面时，newVal为错误id，这个时候是找不到对应的数据的
  if (newVal && `/category/${newVal}` === route.path) getSubList()
}, { immediate: true })// route.path为当前路由的路径，/category/是固定的，${newVal}为app-headeer-nav.vue传过来的id
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }

  .sub-list {
    margin-top: 20px;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;

      li {
        width: 168px;
        height: 160px;

        a {
          text-align: center;
          display: block;
          font-size: 16px;

          img {
            width: 100px;
            height: 100px;
          }

          p {
            line-height: 40px;
          }

          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}

.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;

  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }

  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>