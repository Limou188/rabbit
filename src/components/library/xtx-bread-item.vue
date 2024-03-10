<template>
  <!-- 面包屑组件数据 -->
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <span v-else><slot /></span>
    <i class="iconfont icon-angle-right"></i>
  </div>
</template>

<script setup lang="js" name="XtxBreadItem">
const props = defineProps({
  to:{
    type:[String,Object]
  }
})

// console.log(props);
</script>

<style scoped lang="less">
// 去除 scoped 属性，目的：让样式作用到xtx-bread-item组件

</style>