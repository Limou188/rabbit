<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo">
        <a href="https://www.hortorty.com/web-page/#/home?gameId=xyzwprod"></a>
      </h1>
      <AppHeaderNav />
      <div class="search" v-if="!$route.path.includes('/category/sub/')">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" v-model="msg" v-on:keyup.enter="searchFilter">
      </div>
      <div class="search" v-else @click="goToBottom">
        <p>到底部</p>
      </div>
      <AppHeaderCart />
    </div>
  </header>
  <div v-if="y > 500" class="goTop" @click="goToTop">
    <i class="iconfont icon-backtop">
      <p>回顶部</p>
    </i>
  </div>
</template>

<script setup lang="js" name="AppHeader">
import AppHeaderNav from './app-header-nav.vue'
import AppHeaderCart from './app-header-cart.vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRouter } from 'vue-router'
import Message from './library/Message'
import { useScattered } from '@/stores/modules/scattered'
import { useWindowScroll } from '@vueuse/core'
import { ref } from 'vue'


const { y } = useWindowScroll()
const router = useRouter()
const requestParams = {
  page: 1,
  pageSize: 999,
}
const msg = ref('')
// 键盘事件触发搜索函数
const searchFilter = () => {
  if (msg.value !== '') {
    let stringList = []
    let goodsList = []
    let requestList = []
    const ids = []
    findSubCategoryGoods(requestParams).then(({ result }) => {
      if (result) {
        // map函数和for双重循环，用户输入的关键字去逐个匹配所有商品的名字
        result.items.map(item => {
          for (let i = 0; i < msg.value.length; i++) {
            stringList.push(msg.value[i])
            if (item.name.includes(stringList[i])) {
              // if(goodsList.length >= 1 && !goodsList.includes(item)){
              //   goodsList.value.push(item)
              //   console.log('002');
              // }else if (goodsList.value.length < 1) {
              //   console.log('001');
              //   goodsList.value.push(item)
              // }
              goodsList.push(item)
            }
          }
        })
      }
      requestList = [...goodsList.reduce((map, item) => {
        map.set(item.id, item)
        ids.push(item.id)
        return map
      }, new Map()).values()]
      ids.push('search')
      router.push(`/category/sub/${ids}`)
      // 
    })
  } else {
    Message({ type: 'warn', text: '请输入搜索内容' })
  }
}
// console.log(msg);
// 去顶/底部功能
const scattered = useScattered()
const goToBottom = () => {
  scrollTo({
    top: scattered.scrollHeight,
    behavior: 'smooth'
  })
}
const goToTop = () => {
  scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped lang='less'>
.goTop {
  height: 80px;
  width: 80px;
  position: fixed;
  bottom: 30%;
  right: 15px;
  z-index: 999;
  line-height: 28px;
  padding-top: 10px;
  font-size: 12px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 5px;
  color: #666;
  box-shadow: 5px 5px 20px -8px rgba(#666);
  &:hover{
    color: @xtxColor;
  }
}

.app-header {
  background: #fff;

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url(../assets//images//xyzw.gif) no-repeat center / contain;
      background-size: 500px;
      position: relative;
      top: -10px;
    }
  }

  .navs {
    width: 820px;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;

    li {
      margin-right: 40px;
      width: 38px;
      text-align: center;

      a {
        font-size: 16px;
        line-height: 32px;
        height: 32px;
        display: inline-block;
      }

      &:hover {
        a {
          color: @xtxColor;
          border-bottom: 1px solid @xtxColor;
        }
      }
    }
  }

  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;

    p {
      font-size: 16px;
      text-align: center;

      &:hover {
        color: @xtxColor;
      }
    }

    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }

    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }

  .cart {
    width: 50px;

    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;

      .icon-cart {
        font-size: 22px;
      }

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: @helpColor;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}</style>