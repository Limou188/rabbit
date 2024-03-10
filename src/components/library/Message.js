// 实现使用函数调用xtx-message组件的逻辑
import { createVNode,render } from "vue"
import XtxMessage from "./xtx-message.vue"


// * createVNode —— 创建虚拟 DOM
// * @param 参数1 创建元素类型，必选
// * @param 参数2 创建元素属性
// * @paran 参数3 创建元素内容
// * @description 虚拟 DOM 创建完成后，需要使用 render 函数，才能在页面中渲染

// * render —— 渲染虚拟 DOM
// * @param 参数1 要被渲染的虚拟 DOM，必选
// * @param 参数2 要渲染的位置，必选
// * @description 虚拟 DOM 创建完成后，需要使用 render 函数，才能在页面中渲染

//准备dom容器
// createElement方法是DOM API的一部分，用于在内存中构建新的DOM元素。
const div = document.createElement("div")
// div.setAttribute为新创建的div元素设置一个CSS类名为'xtx-message-container'。
// 这意味着在应用样式表中，所有针对.xtx-message-container选择器定义的样式都将应用于这个div元素。
div.setAttribute('class','xtx-message-container')
// document.body.appendChild(div)：将新创建的div元素添加到当前文档（即页面）body元素的子节点列表末尾。
// 新div就会被渲染到网页上，并且可以根据给定的CSS类名显示相应的样式效果。
document.body.appendChild(div)
// 以上代码会动态地在页面底部添加一个具有特定css类名的div容器


// 定时器标识
let timer = null

export default ({type,text}) => {
  // 实现：根据xtx-message来渲染提示消息
  // 导入组件
  // 根据组件创建虚拟节点,type、text将作为props传递给XtxMessage组件
  const vnode = createVNode(XtxMessage,{type,text})
  // 准备一个dom容器
  // 把虚拟节点渲染在dom容器中
  render(vnode,div)//  渲染虚拟节点到DOM容器中(div)
  clearTimeout(timer)// 清除定时器
  timer = setTimeout(() => {
    render(null,div)// 将当前挂载点的内容替换为null，从而销毁并移除XtxMessage组件。
  },3000)
}

// 根据传入的类型和文本内容创建一个XtxMessage组件实例，并将其渲染到页面上，然后在3秒钟后自动消失。