<template>
  <p>callback</p>
</template>

<script setup>
import Message from '@/components/library/Message'
import { useCartStore,useUserStore } from '@/stores/modules/cart'
import { useRouter } from 'vue-router'


const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
// 合并购物车操作
cartStore.mergeLocalCart().then(() => {
  // 2. 提示
  Message({ type: 'success', text: 'QQ登录成功' })
  // 3. 跳转
  router.push(userStore.redirectUrl || '/')
})
</script>