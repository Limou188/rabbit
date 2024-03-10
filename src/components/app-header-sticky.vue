<template>
  <div class="app-header-sticky" :class="{show:y>=78}">
    <div class="container" v-show="y>=78">
      <RouterLink class="logo" to="/"></RouterLink>
      <AppHeaderNav />
      <div class="right">
        <!-- 待定left -->
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="js" name="AppHeaderSticky">
import AppHeaderNav from './app-header-nav.vue'
import { useWindowScroll } from '@vueuse/core'

// 用useWindowScroll获取y轴滚动条位置
const { y } = useWindowScroll()

// const y = ref(0)
// onMounted(() => {
//   window.onscroll = () => {
//     const scrollTop = document.documentElement.scrollTop
//     y.value = scrollTop
//   }
// })
</script>

<style scoped lang='less'>
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;

  transform: translateY(-100%);
  opacity: 0;
  &.show {
    transition: all 0.3s linear;
    transform: none;
    opacity: 1;
  }

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/xyzw.gif) no-repeat ;
    background-size:300px auto;
    position: relative;
    top: 6px;
    left: -20px;
  }

  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;

    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>