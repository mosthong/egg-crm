import request from '@/utils/request'

/**
 * 数据统计
 * *************************************************************** 
 * @param {*} params 
 * @returns 
 */
// 获取销售人员数据
export function getSalePersonData(params) {
  return request({
    url: '/back/statistics/sales/department',
    method: 'get',
    params
  })
}

// 产品销量
export function getSalesForProducts(params) {
  return request({
    url: '/back/statistics/sales/products',
    method: 'get',
    params
  })
}

// 时间段销量统计
export function getSalesForTimeSlot(params) {
  return request({
    url: '/back/statistics/sales/date',
    method: 'get',
    params
  })
}