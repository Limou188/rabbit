import { defineStore } from "pinia"

// 滚动条高度数据全局化
export const useScattered = defineStore("scattered", {
  actions:{
    setScrollHeight(newScrollHeight){
      this.scrollHeight = newScrollHeight
    }
  },
  state(){
    return {
      scrollHeight: 0,
    }
  },
  // persist:{
  //   key: "scattered",
  //   storage: localStorage,
  //   paths: ["scrollHeight"]
  // }
})