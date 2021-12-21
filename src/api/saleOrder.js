import request from '@/utils/request'

/**
 * 产品管理
 * *************************************************************** 
 * @param {*} params 
 * @returns 
 */
// 获取列表
export function getProductList(params) {
  return request({
    url: '/back/sales/product',
    method: 'get',
    params
  })
}
//新增
export function creatProductItem(data) {
  return request({
    url: '/back/sales/product/creat',
    method: 'post',
    data
  })
}
//修改
export function updateProductItem(data) {
  return request({
    url: '/back/sales/product/update',
    method: 'post',
    data
  })
}
//删除
export function deleteProductItem(data) {
  return request({
    url: '/back/sales/product/delete',
    method: 'post',
    data
  })
}

/**
 * 国家地区管理
 * *************************************************************** 
 * @param {*} params 
 * @returns 
 */
// 获取列表
export function getCountrylist(params) {
  return request({
    url: '/back/sales/country',
    method: 'get',
    params
  })
}
//新增
export function creatCountryItem(data) {
  return request({
    url: '/back/sales/country/creat',
    method: 'post',
    data
  })
}
//修改
export function editCountryItem(data) {
  return request({
    url: '/back/sales/country/update',
    method: 'post',
    data
  })
}
//删除
export function deleteCountryItem(data) {
  return request({
    url: '/back/sales/country/delete',
    method: 'post',
    data
  })
}

/**
 * 销售管理
 * *************************************************************** 
 * @param {*} data 
 * @returns 
 */
// 获取列表
export function getSaleList(params) {
  return request({
    url: '/back/sales/list',
    method: 'get',
    params
  })
}

//新增
export function creatSaleItem(data) {
  return request({
    url: '/back/sales/creat',
    method: 'post',
    data
  })
}
// 批量添加
export function batchAdd(data) {
  return request({
    url: '/back/sales/batchAdd',
    method: 'post',
    data
  })
}
//修改
export function editSaleItem(data) {
  return request({
    url: '/back/sales/update',
    method: 'post',
    data
  })
}

//删除
export function deleteSaleItem(data) {
  return request({
    url: '/back/sales/delete',
    method: 'post',
    data
  })
}




//查询详情 - 没用
export function getSaleItem(id) {
  return request({
    url: '/sales/performance/getById/' + id,
    method: 'get'
  })
}
