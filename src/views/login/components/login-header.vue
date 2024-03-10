<template>
  <header class="login-header">
    <h1 class="logo">
      <RouterLink to="/">
      </RouterLink>
    </h1>
    <RouterLink class="entry" to="/">
      <h3 class="sub">
        <slot></slot>
        <i class="iconfont icon-angle-right"></i>
        <i class="iconfont icon-angle-right"></i>
      </h3>
    </RouterLink>
  </header>
</template>

<script setup name="LoginHeader">
import { RouterLink } from 'vue-router'


</script>

<style scoped lang='less'>
.login-header {
  background: #ffffff;
  border-bottom: 1px solid #e4e4e4;
  .container {
    align-items: flex-end;
    justify-content: space-between;
  }
  .logo {
    width: 200px;
    a {
      display: block;
      height: 80px;
      width: 100%;
      // text-indent: -9999px;
      // background: url(../../../assets/images/logo.png) no-repeat center 18px / contain;
    }
  }
  .sub {
    flex: 1;
    font-size: 20px;
    font-weight: normal;
    margin-bottom: 20px;
    margin-left: 20px;
    color: #3a3939;
  }
  .entry {
    width: 120px;
    // margin-bottom: 38px;
    font-size: 16px;
    i {
      margin-left: 5px;
      font-size: 15px;
      color: @xtxColor;
      letter-spacing: -5px;
    }
  }
}
// img{
//   position: relative;
//   top: 500px;
//   left: 500px;
// }
</style>