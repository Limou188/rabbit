<template>
  <div class="home-panel">
    <div class="header">
      <h4>{{ title }}</h4>
      <XtxMore :to="`${src}`" />
    </div>
    <!-- 商品 -->
    <div class="goods-list">
      <slot></slot>
    </div>
  </div>
</template>

<script setup name="HomePanel">


const props = defineProps({
  title: {
    type:String,
    default:''
  },
  src: {
    type:String,
    default:''
  }
})
console.log(props.src);

</script>

<style scoped lang="less">
.home-panel {
  background-color: #fff;
  padding: 0 20px;
  margin-top: 20px;
  padding-bottom: 10px;
  height: auto;
  .header {
    height: 66px;
    border-bottom: 1px solid #f5f5f5;
    padding: 18px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    h4 {
      font-size: 22px;
      font-weight: normal;
    }
  }
}
.goods-list {
    display: flex;
    justify-content: space-around;
    padding-top: 20px;
  }
</style>