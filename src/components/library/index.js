// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
import XtxSkeleton from "./xtx-skeleton.vue"
import XtxMore from "./xtx-more.vue"
import defaultImg from '@/assets/images/200.png'
import XtxCarousel from './xtx-carousel.vue'
import XtxBread from "./xtx-bread.vue"
import XtxBreadItem from './xtx-bread-item.vue'
import XtxCheckbox from "./xtx-checkbox.vue"
import XtxInfiniteLoadingVue from "./xtx-infinite-loading.vue"
import XtxButton from "./xtx-button.vue"
import XtxNumbox from "./xtx-numbox.vue"
import XtxCity from "./xtx-city.vue"
import XtxPagination from './xtx-pagination.vue'
import XtxMessage from "./xtx-message.vue"
import Message from "./Message"
import XtxDialog from ".//xtx-dialog.vue"
import XtxPayResultPage from "./xtx-pay-result-page.vue"
import XtxTabsPanel from "./xtx-tabs-panel.vue"
import XtxTabs from "./xtx-tabs.vue"
import XtxSteps from './xtx-steps.vue'
import XtxStepsItem from './xtx-steps-item.vue'



// 指令
const defineDirective = (app) => {
  // 图片懒加载指令 v-lazyload
  app.directive('lazyload', {
    // vue2.0 inserted函数，元素渲染后
    // vue3.0 mounted函数，元素渲染后
    mounted(el, binding) {
      // 元素插入后才能获取到dom元素，才能使用 intersectionobserve进行监听进入可视区
      // el 是图片元素  binding.value 图片地址
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      observer.observe(el)
    }
  })
}

export default {
  install(app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    defineDirective(app)
    app.component('XtxSkeleton', XtxSkeleton)
    // app.component('XtxCarousel', defineAsyncComponent(() =>
    //   import('./xtx-carousel.vue')
    // ))
    app.component('XtxCarousel', XtxCarousel)
    app.component('XtxMore', XtxMore)
    app.component('XtxBread', XtxBread)
    app.component('XtxBreadItem', XtxBreadItem)
    app.component('XtxCheckbox', XtxCheckbox)
    app.component('XtxInfiniteLoadingVue', XtxInfiniteLoadingVue)
    app.component('XtxNumbox',XtxNumbox)
    app.component('XtxCity',XtxCity)
    app.component('XtxButton',XtxButton)
    app.component('XtxPagination',XtxPagination)
    app.component('XtxMessage',XtxMessage)
    app.component('XtxDialog',XtxDialog)
    app.component('XtxPayResultPage',XtxPayResultPage)
    app.component('XtxTabsPanel',XtxTabsPanel)
    app.component('XtxTabs',XtxTabs)
    app.component('XtxSteps',XtxSteps)
    app.component('XtxStepsItem',XtxStepsItem)
    // 如果要挂载全局的属性，可以通过组件实例调用的属性 this.$message
    app.config.globalProperties.$message = Message // 原型函数
  }
}


// // 其实就是vue插件，扩展vue功能，全局组件、指令、函数 （vue.30取消过滤器）
// // 当你在mian.js导入，使用Vue.use()  (vue3.0 app)的时候就会执行install函数
// // import XtxSkeleton from './xtx-skeleton.vue'
// // import XtxCarousel from './xtx-carousel.vue'
// // import XtxMore from './xtx-more.vue'
// // import XtxBread from './xtx-bread.vue'
// // import XtxBreadItem from './xtx-bread-item.vue'

// // 导入library文件夹下的所有组件
// // 批量导入需要使用一个函数 require.context(dir,deep,matching)
// // 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
// const importFn = require.context('./', false, /\.vue$/)
// // console.dir(importFn.keys()) 文件名称数组
// export default {
//   install(app) {
//     // 批量注册全局组件
//     importFn.keys().forEach(key => {
//       // 导入组件
//       const component = importFn(ket).default
//       // 注册组件
//       app.component(component.name, component)
//     })
//     // 注册全局指令
//     defineDirective(app)
//   }
// }

// const defineDirective = (app) => {
//   // 图片懒加载指令 v-lazyload
//   app.directive('lazyload', {
//     // vue2.0 inserted函数，元素渲染后
//     // vue3.0 mounted函数，元素渲染后
//     mounted (el, binding) {
//       // 元素插入后才能获取到dom元素，才能使用 intersectionobserve进行监听进入可视区
//       // el 是图片元素  binding.value 图片地址
//       const observe = new IntersectionObserver(([{ isIntersecting }]) => {
//         if (isIntersecting) {
//           el.src = binding.value
//           // 取消观察
//           observe.unobserve(el)
//         }
//       }, {
//         threshold: 0.01
//       })
//       // 进行观察
//       observe.observe(el)
//     }
//   })
// }
