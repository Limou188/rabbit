<template>
  <p>login-path</p>
</template>

<script setup>
import Message from '@/components/library/Message'
import { useCartStore } from '@/stores/modules/cart'
import { useRouter } from 'vue-router'


const router = useRouter()
const cartStore = useCartStore()
// 合并购物车操作
cartStore.mergeLocalCart().then(() => {
  // 2. 提示
  Message({ type: 'success', text: '完善信息成功' })
  // 3. 跳转
  router.push(store.state.user.redirectUrl || '/')
})
</script>