<template>
  <!-- 二级分类下的面包屑导航栏 -->
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <!-- XtxBreadItem组件本身是一个RouterLink标签，并且在标签中设置了插槽（slot）
    所以可以通过slot标签将{{ category.top.name }}给渲染出来
    并且通过:to="`/category/${category.top.id}`"可以动态的把地址传递给XtxBreadItem组件
    当点击{{ category.top.name }}的时候，则会触发RouterLink的跳转，跳转的地址为:to传递的地址 -->
     <!-- top为一级面包屑，组件中:to是在传递数据 -->
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{ category.top.name }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <!-- sub为二级面包屑，由于这是面包屑的最后一项，所以不需要传递地址来实现跳转，因为本页面即是目标页面 -->
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{ category.sub.name }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script setup lang="js" name="SubBread">
import { useCategoryStore } from '@/stores/modules/category'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// 注意：setup中this不是当前vue实例

// 1. 获取二级分类的ID，在地址在路由中
// route ===> this.$route
const route = useRoute()
// console.log(route.params);
// console.log(route.params.id)
// 2. 获取vuex中的类目数据
// store ===> this.$store
const useCategory = useCategoryStore()
// console.log(useCategory)
// 3. 通过计算属性得到，一级类目(top)的名称和ID，二级类目(sub)的名称和ID
const category = computed(() => {
  const obj = {}
  useCategory.list.forEach(top => {
    // console.log(useCategory.list);
    // 首先判断top.children是否存在，如果存在，则使用forEach遍历top.children，其中每一项为sub，判断sub.id是否等于当前的路由参数
    top.children && top.children.forEach(sub => {
      if (sub.id === route.params.id) {
        // 设置一级类目
        obj.top = { id: top.id, name: top.name }
        // 设置二级类目
        obj.sub = { id: sub.id, name: sub.name }
      }
    })
  })
  return obj
})
</script>