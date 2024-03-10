// hooks 封装逻辑，提供响应式数据。实现图片懒加载
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
// dayjs将时间或时间戳转换为日期格式 2000-01-01 00:00:00
import dayjs from 'dayjs'


// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 有两个参数
  // 1. 被观察的对象（target）
  // 2. 不同的API函数（apiFn）
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        // 调用API获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }
  )
  // 返回--->数据（dom,后台数据）
  // target.value 被观察的对象,result.value 懒加载得到的数据
  return { target, result }
}

// 支付倒计时函数
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)// 倒计时时间
  const timeText = ref('')// 倒计时显示文本
  const { pause, resume } = useIntervalFn(() => {
    // console.log('1');
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')// 将剩余时间转换成20分15秒格式
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
   // 在组件卸载时停止计时器
  onUnmounted(() => {
    pause()
  })
// 开启倒计时方法，接收一个参数countdown（以秒为单位）
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')// 将剩余时间转换成20分15秒格式
    // 开启计时器
    resume()
  }
  return {
    start,
    timeText
  }
}

