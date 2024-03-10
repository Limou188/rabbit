import { createVNode,render } from 'vue'
import xtxConfirm from './xtx-confirm.vue'

// 准备div
const div = document.createElement('div')
div.setAttribute('class','xtx-confirm-container')
document.body.appendChild(div)

// 该函数渲染XtxConfirm组件，标题和文本
// 函数的返回值是promise对象
export default ({title,text}) => {
  return new Promise((resolve,reject) => {
    const submitCallback = () => {
      console.log('点击确认');
      render(null,div)
      resolve()
    }
    const cancelCallback = () => {
      console.log('点击取消');
      render(null,div)
      reject(new Error('点击取消'))
    }
    // 渲染组件
    // 点击确认按钮，触发resolve同时销毁组件
    // 点击取消按钮，触发reject同时销毁组件
    // 创建一个虚拟节点 (vnode)，使用 xtxConfirm 组件并传入所需的 props
    const vnode = createVNode(xtxConfirm,{title,text,submitCallback,cancelCallback})
    render(vnode,div)
  })
}