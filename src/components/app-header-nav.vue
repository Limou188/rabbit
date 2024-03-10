<template>
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <!-- 根据list的数据循环生成，每个li中的RouterLink是List的子项，每个RouterLink都有自己的id和其他属性，
    点击时通过:to="`/category/${item.id}`"将自己对应的id传递给路由，由category组件下的index.vue接收-->
    <li v-for="item in list" :key="item.id" @mouseover="show(item)">
      <RouterLink :to="`/category/${item.id}`" @click="hide(item)">{{ item.name }}</RouterLink>
      <div class="layer" v-if="!$route.path.includes('search') && item.open " >
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <!-- 原理同上，sub.id为子项的id，也就是二级分类的id，后续接收id的组件可以通过这个id从请求的数据中找到对应的数据 -->
            <!-- 点击跳转的同时将sub.id传递给路由并触发hide方法将二级分类列表隐藏 -->
            <RouterLink :to="`/category/sub/${sub.id}`" @click="hide(item)">
              <img :src="sub.picture" alt="">
              <p>{{ sub.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup lang="js" name="AppHeaderNav">
import { useCategoryStore } from '@/stores/modules/category'
import { computed } from 'vue'


// useCategoryStore获取顶级分类数据
const useCategory = useCategoryStore()
useCategory.getCategory()

const list = computed(() => {
  return useCategory.list
})
const show = (item) => {// 鼠标移动到一级分类列表上时触发，自动显示二级分类列表
  useCategory.show(item)
}
const hide = (item) => {// 鼠标离开和点击二级分类列表时触发，隐藏二级分类列表
  useCategory.hide(item)
}

</script>

<style scoped lang='less'>
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;

  >li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    >a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }

    &:hover {
      >a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }

      >.layer {
        height: 132px;
        opacity: 1;
      }
    }
  }
}

.layer {
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;

    li {
      width: 110px;
      text-align: center;

      img {
        width: 60px;
        height: 60px;
      }

      p {
        padding-top: 10px;
      }

      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}</style>