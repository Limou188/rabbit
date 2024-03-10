import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  actions: {
    // vuex写法
    // setList (state, headCategory) {
    //   state.list = headCategory
    // }
    setList(headCategory) {
      this.list = headCategory
    },
    
    async getList() {
      const { result } = await findAllCategory()
      // 获取数据成功，提交mutations进行数据修改,以下为vuex写法，由于我用的是pinia所以代码需要更改
      // console.log(result);
      this.setList(result)
    },

    async getCategory() {
      const { result } = await findAllCategory()
      // 给一级分类加上一个控制二级分类显示隐藏的数据open
      result.forEach(item => {
        // console.log('001');
        item.open = false
      })
      // 以下为完整写法
      // result.forEach(function(item,index,array)
      //  { item.open = false })

      // 获取数据成功，提交mutations进行数据修改
      this.setList(result)
    },

       // 修改当前一级分类下的open数据为true
    show(item){
      const category = this.list.find(category => category.id === item.id)
      item.open = true
    },

       // 修改当前一级分类下的open数据为false
    hide(item){
      // console.log('关闭');
      const category = this.list.find(category => category.id === item.id)
      item.open = false
    }
  },

  state() {
    return {
      // 如果默认是[]数组，看不见默认的9个分类，等数据加载完毕才会看到。
      // 所以：根据常量数据来生成一个默认的顶级分类数据，不会出现空白（没数据的情况）
      // 使用map方法生成一个默认的顶级分类数据
      list: topCategory.map(item => ({ name: item }))
    }
  }
})