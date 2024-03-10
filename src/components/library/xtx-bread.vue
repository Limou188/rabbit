<template>
  <!-- 面包屑组件样式 -->
  <div class='xtx-bread'>
    <slot />
  </div>
</template>

<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // 用法
    // 1. template 标签去除，单文件组件
    // 2. 返回值就是组件内容
    // 3. vue2.0 的h函数传参进来的，vue3.0 的h函数导入进来
    // 4. h 第一个参数 标签名字  第二个参数 标签属性对象  第三个参数 子节点
    // 需求
    // 1. 创建xtx-bread父容器
    // 2. 获取默认插槽内容
    // 3. 去除xtx-bread-item组件的i标签，因该由render函数来组织
    // 4. 遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
    // 5. 把动态创建的节点渲染再xtx-bread标签中
    const items = this.$slots.default()
    const dymanicItems = []
    items.forEach((item, i) => {
      dymanicItems.push(item)
      if (i < (items.length - 1)) {
        dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  }
}
</script>

<!-- vue3setup语法糖写法 -->
<!-- <template>
  <div>
    <renderButton />
  </div>
</template>
 
<script setup>
import { h, ref } from "vue";
const renderButton = {
  render: () => {
    return h(
      // 1. 要渲染的标签名称：第一个参数【必需】
      "button",
      // 2. 渲染标签的属性：第二个参数【可选】
      {
        style: {
          color: "#333",
          border: "1px solid #ccc",
        },
        class: "",
        id: "",
        onClick: changeNum,
      },
      // 3. 渲染标签的子元素数组：第三个参数【可选】
      [
        // "render函数文本" 文本内容可以直接写入
        h("p", num.value), // h()创建的VNodes
      ]
    );
  },
};
let num = ref(0);  // vue3中需要使用ref或reactive声明变量，否则无法实现双向数据绑定
const changeNum = () => {
  num.value++    // 改变ref定义的变量值需要使用.value , reactive不需要 
}
</script> -->

<style lang='less'>
// 去除 scoped 属性，目的：让样式作用到xtx-bread-item组件
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  // ul li:last-child {}
  // 先找到父元素，找到所有的子元素，找到最后一个，判断是不是LI，是就是选中，不是就是无效选择器
  // ul li:last-of-type {}
  // 先找到父元素，找到所有的类型为li的元素，选中最后一个
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 样式，去除
    // &:last-child {
    //   display: none;
    // }
  }
}
</style>