<template>
  <div class="container">
    <!-- 左侧列表 -->
    <AppMemberAside />
    <article class="article">
      <RouterView />
    </article>  
  </div>
</template>

<script setup name="AppMemberLayout">
import AppMemberAside from '@/components/app-member-aside.vue'


</script>

<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  .article {
    width: 1000px;
  }
}
</style>