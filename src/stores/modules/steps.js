import { defineStore } from "pinia"

export const useStepsStore = defineStore("steps", {
  actions: {
    setSteps(goods) {
      // 不重复添加
      if (!this.steps.includes(goods)) {
        this.steps.unshift(goods)
        // 如果数组长度大于12，就删除最后一个
        if (this.steps.length > 12 ) {
          this.steps.pop()
        }
      }
    }
  },
  state() {
    return {
      // 我的足迹信息
      steps: [],
    }
  },
  persist: {
    key: "steps",
    storage: localStorage,
    paths: ["steps"]
  }
})