<template>
  <Transition name="down">
    <div class='xtx-message' :style="style[type]" v-show="visible" ref="views">
      <!-- 上面绑定的是样式 -->
      <!-- 不同的提示图标会变 -->
      <i class="icontfont" :class="[style[type]].icon"></i>
      <span class="text">{{ text }}</span>
    </div>
  </Transition>
</template>

<script setup namespace="XtxMessage">
import { onMounted, ref } from 'vue'


const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    // warn警告,error错误，success成功
    default: ''
  }
})
// 定义一个对象，包含三种情况的样式，对象key就是类型字符串
const style = {
  warn: {
    icon: 'icon-warning',
    color: '#E6A23C',
    backgroundColor: 'rgb(253, 246, 236)',
    borderColor: 'rgb(250, 236, 216)'
  },
  error: {
    icon: 'icon-shanchu',
    color: '#F56C6C',
    backgroundColor: 'rgb(254, 240, 240)',
    borderColor: 'rgb(253, 226, 226)'
  },
  success: {
    icon: 'icon-queren2',
    color: '#67C23A',
    backgroundColor: 'rgb(240, 249, 235)',
    borderColor: 'rgb(225, 243, 216)'
  }
}

// 定义一个数据控制显示隐藏，默认是隐藏，组件挂载完毕显示
const visible = ref(false)
onMounted(() => {
  visible.value = true
})

// // 获取当前节点
// const {proxy} = getCurrentInstance()
// // 创建一个ref来存储宽度
// const componentWidth = ref(0)
// onMounted(()=>{
//   // 当组件挂载完毕，给该变量赋值当前节点的宽度
//   // componentWidth.value = proxy.$el.clientWidth
//   console.log(proxy);
// })

</script>

<style lang="less" scoped>
.down {
  &-enter {
    &-from {
      transform: translate3d(0, -75px, 0);
      opacity: 0;
    }

    &-active {
      transition: all 0.5s;
    }

    &-to {
      transform: none;
      opacity: 1;
    }
  }
}

.xtx-message {
  width: 260px;
  height: 50px;
  position: fixed;
  z-index: 9999;
  left: 50%;
  margin-left: -100px;
  text-align: center;
  top: 25px;
  line-height: 46px;
  padding: 0 25px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;

  i {
    margin-right: 4px;
    vertical-align: middle;
  }

  .text {
    vertical-align: middle;
  }
}
</style>