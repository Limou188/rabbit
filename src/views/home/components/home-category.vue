<template>
  <div class='home-category' :class="fade" @mouseleave="categoryId = null">
    <!-- 左侧分类列表 -->
    <ul class="menu">
      <!-- 当鼠标进入li列表，将所在li的值赋给categoryId -->
      <li v-for="item of menuList" :key="item.id" @mouseenter="categoryId = item.id"
        :class="{ active: categoryId === item.id }">
        <RouterLink :to="`/category/${item.id}`">
          {{ item.name }}
        </RouterLink>
        <template v-if="item.children">
          <!-- // 传递的是一级分类id -->
          <RouterLink v-for="sub of item.children" :key="sub.id" :to="`/category/sub/${sub.id}`">
            {{ sub.name }}
          </RouterLink>
        </template>
        <span v-else>
          <XtxSkeleton width="60px" height="18px" style="margin-right: 5px;" bg="rgba(255,255,255,0.2)" />
          <XtxSkeleton width="50px" height="18px" bg="rgba(255,255,255,0.2)" />
        </span>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer" :class="fade" v-if="categoryId">
      <h4 v-if="currCategory">{{ currCategory.id === 'brand' ? '品牌' : '分类' }}推荐<small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 商品列表 -->
      <ul v-if="currCategory && currCategory.goods && currCategory.goods.length">
        <li v-for="item in currCategory.goods.slice(0, 9)" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌列表 -->
      <ul v-if="currCategory && currCategory.brands && currCategory.brands.length">
        <li class="brand" v-for="item in currCategory.brands.slice(0, 9)" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{ item.place }}</p>
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis-2">{{ item.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="js" name="HomeCategory">
import { useCategoryStore } from '@/stores/modules/category'
import { reactive, computed, ref } from 'vue'
import { RouterLink } from 'vue-router';
import { findBrand } from '@/api/home'
import { emitter } from '@/utils/mitt'

// 组织所有数据逻辑
// 1. 获取vuex的一级分类，并且只需要两个二级分类
// 2. 需要在组件内部，定义一个品牌数据
// 3. 根据vuex的分类数据和组件中定义品牌数据，得到左侧分类完整数据(9分类+1品牌)数组
// 4. 进行渲染即可


// 控制遮罩层的显示
const fade = ref(false)
// 自定义一个品牌数据，放在数组最后面
const brand = reactive({
  id: 'brand',
  name: '品牌',
  children: [{ id: 'brand-chilren', name: '品牌推荐' }],
  brands: []
})
// 获取pinia中的分类数据
const useCategory = useCategoryStore()
const menuList = computed(() => {
  // .map会对数组中每一项都进行遍历并执行回调函数，返回一个新的数组
  // 使用.map方法，对数组中每一项进行重新赋值
  const list = useCategory.list.map(item => {
    return {
      id: item.id,
      name: item.name,
      // 使用slice取出子分类中的前两个来当二级分类
      // item.children && 防止初始化没有children的时候调用slice函数报错，因为slice不能对空数组操作
      children: item.children && item.children.slice(0, 2),
      goods: item.goods
    }
  })
  // 将brand添加到数组最后面
  // 注意：push方法是不会改变原数组的，所以需要重新赋值给list
  list.push(brand)
  return list
})

// 获取当前分类逻辑
const categoryId = ref(null)
const currCategory = computed(() => {
  emitter.emit('dim', categoryId.value) // 使用mitt进行同级组件通信
  // 用.find方法找到menuList.value中与categoryId.value相等的对象
  // categoryId.value是鼠标当前选中的分类id
  return menuList.value.find(item => item.id === categoryId.value)
})

// 初始化时获取品牌数据
findBrand().then(data => {
  brand.brands = data.result
})

</script>

<style scoped lang='less'>
.xtx-skeleton {
  animation: fade 2s linear infinite alternate;
}

@keyframes fade {
  from {
    opacity: 0.2;
  }

  to {
    opacity: 1;
  }
}

.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;

  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;

      &:hover,
      &.active {
        background: @xtxColor;
      }

      a {
        margin-right: 4px;
        color: #fff;

        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}

.layer {
  width: 990px;
  height: 500px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 250px;
  top: 0;
  display: none;
  padding: 0 15px;

  h4 {
    font-size: 20px;
    font-weight: normal;
    line-height: 80px;

    small {
      font-size: 16px;
      color: #666;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 310px;
      height: 120px;
      margin-right: 15px;
      margin-bottom: 15px;
      border: 1px solid #eee;
      border-radius: 4px;
      background: #fff;

      &:nth-child(3n) {
        margin-right: 0;
      }

      a {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        padding: 10px;

        &:hover {
          background: #e3f9f4;
        }

        img {
          width: 95px;
          height: 95px;
        }

        .info {
          padding-left: 10px;
          line-height: 24px;
          width: 190px;

          .name {
            font-size: 16px;
            color: #666;
          }

          .desc {
            color: #999;
          }

          .price {
            font-size: 22px;
            color: @priceColor;

            i {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}

li.brand {
  height: 180px;

  a {
    align-items: flex-start;

    img {
      width: 120px;
      height: 160px;
    }

    .info {
      p {
        margin-top: 8px;
      }

      .place {
        color: #999;
      }
    }
  }
}

&:hover {
  .layer {
    display: block;
  }
}
</style>