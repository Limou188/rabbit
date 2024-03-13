import { RouterView, createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'
import Home from '@/views/home/index.vue'
import { useUserStore } from '@/stores/modules/user'
import { h } from 'vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '/',
          component: Home,//heme下的index.vue
        },
        // {
        //   path:'/search/:id',

        // },
        {
          // 通过:id提前占位，接收一个名字为id的参数
          //一级分类id
          path: '/category/:id',
          component: () => import('@/views/category/index.vue')
        },
        {
          //二级分类id
          name: 'subCategory',
          path: '/category/sub/:id?',
          component: () => import('@/views/category/sub-category.vue')
        },
        {
          path: '/product/:id',
          component: () => import('@/views/goods/index.vue')
        },
        {
          // 个人中心首页(左侧列表)
          path: '/member',
          component: () => import('@/views/member/layout.vue'),
          children: [
            {
              // 个人中心首页
              path: '/member',
              component: () => import('@/views/member/home/index.vue'),
            },
            {
              // 个人中心足迹页面
              path: '/member/steps',
              component:() => import('@/views/member/home/components/home-steps.vue')
            },            {
              // 修改个人信息页面
              path: '/member/personal',
              component:() => import('@/views/member/home/components/home-personal.vue')
            },
            {
              // 个人中心订单页面
              path: '/member/order/',
              // vue3需要有嵌套关系才能模糊匹配
              component: { render: () => h(RouterView) },
              children: [
                {
                  // 个人中心订单页面
                  path: '',
                  component: () => import('@/views/member/order/index.vue')
                },
                // {
                //   path:':id',
                //   component: MemberOrderDetail
                // }
              ]
            },
            // {
            //   path:'/member/order/:id',
            //   component: () => import('@/views/member/order/components/index.vue')
            // },
          ]
        }
      ]
    },
    {
      // 登录页面
      path: '/login/:id?',
      component: () => import('@/views/login/index.vue')
    },
    {
      // 购物车页面
      path: '/cart',
      component: () => import('@/views/cart/index.vue')
    },
    {
      // 提交订单页面
      path: '/member/checkout',
      component: () => import('@/views/member/pay/checkout.vue')
    },
    {
      // 支付页面
      path: '/member/pay',
      component: () => import('@/views/member/pay/index.vue')
    },
    {
      // 支付结果页面
      path: '/pay/result',
      component: () => import('@/components/library/xtx-pay-result-page.vue')
    }
  ],
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // console.log('001');
  const userStore = useUserStore()
  // 用户登录信息
  const { token } = userStore.profile
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})


export default router