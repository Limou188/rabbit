<template> 
  <!-- <LoginHeader>返回首页</LoginHeader> -->
  <AppTopnav class="topCss"/>
  <AppHearder class="headerCss"/>
  <section class="login-section">
    <div class="wrapper">
      <nav>
        <a href="javascript:;" @click="activeName = 'account'" :class="{ active: activeName === 'account' }">账户登录</a>
        <a href="javascript:;" @click="activeName = 'qrcode'" :class="{ active: activeName === 'qrcode' }">扫码登录</a>
      </nav>
      <!-- 表单 -->
      <LoginForm v-if="activeName === 'account'"></LoginForm>
      <!-- 二维码 -->
      <div v-if="activeName === 'qrcode'" class="qrcode-box">
        <img src="@/assets/images/QR.jpg" height="200px" alt="李某">
        <p>打开<a href="javascript:;">原神App</a>扫码登入</p>
      </div>
    </div>
  </section>
  <LoginFooter />
</template>

<script setup name="Login">
import LoginFooter from './components/login-footer.vue'
import LoginForm from './components/login-form.vue'
// import { Form, Field } from 'vee-validate'
import { ref } from 'vue'
import AppHearder from '@/components/app-hearder.vue'
import AppTopnav from '@/components/app-topnav.vue'

const activeName = ref('account')


</script>

<style lang="less" scoped>
.headerCss {
  // background: url(../../assets/images/200.png) no-repeat 0px -53px / cover;
  height: 110px;
}
.login-section {
  // background: url(../../assets/images/200.png) no-repeat 0px -163px / cover;
  background: url(../../assets/images/200.png) no-repeat center / cover;
  height: 500px;
  position: relative;

  .wrapper {
    width: 380px;
    background: #ffffff;
    min-height: 400px;
    position: absolute;
    left: 64%;
    top: 48px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, .15);

    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;

        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }

        &.active {
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
  }
}

// 二维码容器
.qrcode-box {
  text-align: center;
  padding-top: 40px;

  p {
    margin-top: 20px;

    a {
      color: @xtxColor;
      font-size: 16px;
    }
  }
}
</style>