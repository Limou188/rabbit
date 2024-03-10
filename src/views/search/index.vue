<template>
  <p>搜索</p>
  <input type="text" v-model="msg" v-on:keyup.enter="searchGoods"/>
</template>

<script setup name="SearchPage">
import { findSearchGoods } from '@/api/search'
import { ref } from 'vue'

const msg = ref('')
const searchGoods = () => {
  console.log(msg);
  findSearchGoods(msg.value).then(res => {
    console.log(res);
  })
}
</script>