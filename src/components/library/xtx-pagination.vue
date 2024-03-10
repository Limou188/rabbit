<template>
  <div class="xtx-pagination" v-if="total>0">
    <a v-if="myCurrentPage<=1" href="javascript:;" class="disabled">上一页</a>
    <a @click="changePage(myCurrentPage-1)" v-else href="javascript:;">上一页</a>
    <span v-if="pager.start>1">...</span>
    <a @click="changePage(i)" href="javascript:;" :class="{active:i===myCurrentPage}" v-for="i in pager.btnArr" :key="i">{{i}}</a>
    <span v-if="pager.end<pager.pageCount">...</span>
    <a v-if="myCurrentPage>=pager.pageCount" href="javascript:;" class="disabled">下一页</a>
    <a @click="changePage(myCurrentPage+1)" v-else href="javascript:;">下一页</a>
  </div>
</template>
<script setup name="XtxPagination">
import { ref, watch, computed } from 'vue';

const props = defineProps({
  total:{
    type: Number,
    default: 100
  },
  currentPage:{
    type: Number,
    default: 1
  },  
  pageSize:{
    type: Number,
    default: 10
  },
}) 

// 评论总条数
let myTotal = ref(100)
// 每页评论条数
let myPageSize = ref(10)
// 当前第几页
let myCurrentPage = ref(1)
// 按钮个数
let btnCount = 5

// 根据上诉数据得到（总页数、起始页码、结束页码、按钮数组）
const pager = computed(()=>{
  // 计算总页数,Math.ceil对结果向上取整
  const pageCount = Math.ceil(myTotal.value / myPageSize.value)
  // 计算起始页码和结束页码
  // 1.理想情况根据当前页码和按钮个数可以得到,Math.floor向下取整
  let start = myCurrentPage.value - Math.floor(btnCount / 2)// 1 - 2 = -1
  let end = start + btnCount - 1
  // 2.如果起始页码小于1，需要重新计算
  if(start < 1){
    start = 1
    end = (start + btnCount - 1) > pageCount ? pageCount : (start + btnCount - 1)
  }
  // 3.如果结束页码大于总页数，需要重新计算
  if(end > pageCount){
    end = pageCount
    start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
  }
  // 处理完毕start和end得到按钮数组
  const btnArr = []
  for(let i = start; i <= end; i++){
    btnArr.push(i)
  }
  return {pageCount,start,end,btnArr}
})

const emit = defineEmits(['current-change'])
// 改变页码
const changePage = (newPage) => {
  if(myCurrentPage.value !== newPage){
    myCurrentPage = newPage
    // 通知父组件更新页码
    emit('current-change',newPage)
  }
}
// function changePage(newPage){
//   myCurrentPage = newPage
// }

// 监听外部传入的数据,对自定义数据重新赋值
watch(props, ()=>{
  myTotal.value = props.total
  myPageSize.value = props.pageSize
  myCurrentPage = props.currentPage
},{immediate: true})

</script>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;

  >a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;

    &:hover {
      color: @xtxColor;
    }

    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;

      &:hover {
        color: #333
      }
    }
  }

  >span {
    margin-right: 10px;
  }
}
</style>