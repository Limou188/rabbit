<template>
  <!-- 装载内容 -->
  <div class="xtx-tabs-panel" v-show="activeName===name">
    <slot/>
  </div>
</template>

<script setup name="XtxTabsPanel">
import { inject } from 'vue'


const props = defineProps({
  // 标签页标题文章
  label: {
    type:String,
    default:''
  },
  // 唯一标识
  name: {
    type:String,
    default:''
  }
})

// 当前组件该不该显示,取决于xtx-tabs组件的activeName数据是否和props.name一致
const activeName = inject('activeName')

</script>

<style scoped lang="less">

</style>