<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="userStore.profile.token">
          <li><RouterLink to="/member"><i class="iconfont icon-user"></i>{{profile.account}}</RouterLink></li>
          <li><a href="javascript:;" @click="logout()">退出登录</a></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;" @click="goOrder">我的订单</a></li>
        <li><a href="javascript:;" @click="goMember">会员中心</a></li>
        <li><a href="https://pvp.qq.com/">帮助中心</a></li>
        <li><a href="https://weibo.com/u/1776448504">关于我们</a></li>
        <li><a href="https://ymzx.qq.com/"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script setup lang="js" name="AppTopnav">
import { useUserStore } from '@/stores/modules/user'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import Message from './library/Message'
import { useCartStore } from '@/stores/modules/cart'


// 用户登入
const userStore = useUserStore()
const profile = computed(()=>{
  return userStore.profile
})
const cartStore = useCartStore()
// 退出登入
const router = useRouter()
const logout = () => {
  userStore.setUser({})
  cartStore.setCartList([])
  Message({ type: 'success', text: '退出登录成功' })
  router.push('/')
}
// 会员中心
const goMember = () => {
  if(profile.value.token){
    router.push('/member')
  }else{
    Message({ type: 'warn', text: '请先登录' })
  }
}
// 我的订单
const goOrder = () => {
  if(profile.value.token){
    router.push('/member/order')
  }else{
    Message({ type: 'warn', text: '请先登录' })
  }
}
</script>

<style scoped lang="less">
// @import "@/assets/styles/variables.less";
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>