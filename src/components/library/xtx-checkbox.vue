<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <!-- 勾选 -->
  <i v-if="checked" class="iconfont icon-checked"></i>
    <!-- 取消勾选 -->
  <i v-else class="iconfont icon-unchecked"></i>
  <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script setup lang="js" name="XtxCheckbox">
import { ref, watch } from 'vue';
// v-model  ====>  :modelValue  +   @update:modelValue
const props = defineProps({
  modelValue: {
    type:Boolean,
    default: ''
  }
})

const emit = defineEmits(['change'])
const checked = ref()

const changeChecked = () => {
  // checked.value = !checked.value
   // 使用emit通知父组件数据的改变
  //  console.log(props);
  emit('change',checked.value)
}

// 使用侦听器，得到父组件传递数据，给checked数据
watch(() => props.modelValue,()=>{
  // console.log(props.modelValue);
  checked.value = props.modelValue
},{immediate:true})


// vueuse/core 的实现
// import { useVModel } from '@vueuse/core'
// // v-model  ====>  :modelValue  +   @update:modelValue
// export default {
//   name: 'XtxCheckbox',
//   props: {
//     modelValue: {
//       type: Boolean,
//       default: false
//     }
//   },
//   setup (props, { emit }) {
//     // 使用useVModel实现双向数据绑定v-model指令
//     // 1. 使用props接收modelValue
//     // 2. 使用useVModel来包装props中的modelValue属性数据
//     // 3. 在使用checked.value就是使用父组件数据
//     // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
//     const checked = useVModel(props, 'modelValue', emit)
//     const changeChecked = () => {
//       const newVal = !checked.value
//       // 通知父组件
//       checked.value = newVal
//       // 让组件支持change事件
//       emit('change', newVal)
//     }
//     return { checked, changeChecked }
//   }
// }
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>