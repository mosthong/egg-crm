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