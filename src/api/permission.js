import request from '@/utils/request'

/**
 * 部门/角色管理
 * *************************************************************** 
 * @param {*} params 
 * @returns 
 */
// 获取列表
export function getRolesList(params) {
  return request({
    url: '/back/permission/roles/list',
    method: 'get',
    params
  })
}
// 新增
// export function creatRolesItem(data) {
//   return request({
//     url: '/back/sales/product/creat',
//     method: 'post',
//     data
//   })
// }
// 修改
// export function updateRolesItem(data) {
//   return request({
//     url: '/back/sales/product/update',
//     method: 'post',
//     data
//   })
// }
// 删除
// export function deleteRolesItem(data) {
//   return request({
//     url: '/back/sales/product/delete',
//     method: 'post',
//     data
//   })
// }