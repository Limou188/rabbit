import request from '../utils/request'

/**
 * 搜索框
 * @param {String} keywords - 用户输入的关键字
 * @returns
 */

export const findSearchGoods = (params) => {
  return request('/search/all','post',params)
}

