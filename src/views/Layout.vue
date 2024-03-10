<template>
  <!-- 顶部列表（用户注册登入等） -->
  <AppTopnav />
  <!-- 头部分类列表 -->
  <AppHeader />
  <!-- 吸顶分类列表 -->
  <AppHeaderSticky />
  <!-- 二级路由,所有页面内容都在这里呈现 -->
  <RouterView></RouterView>
  <!-- 页面底部 -->
  <AppFooter />
</template>

<script setup lang="js" name='Layout'>
import AppTopnav from "@/components/app-topnav.vue";
import AppHeader from "@/components/app-hearder.vue";
import AppFooter from "@/components/app-footer.vue";
import { useCategoryStore } from '@/stores/modules/category'
import AppHeaderSticky from '@/components/app-header-sticky.vue'


// 在初始化的时候调用一下
const useCategory = useCategoryStore()
useCategory.getList()

</script>

<style lang="less" scoped>
.app-body {
  min-height: 600px;
}
</style>