import request from '@/utils/request'


// 获取用户信息
export function getCsrfToken() {
  return request({
    url: '/csrfToken',
    method: 'get'
  })
}

// 授权登录
export function login(data) {
  return request({
    url: '/back/users/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/back/users/info',
    method: 'get'
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/back/users/list',
    method: 'get',
    params
  })
}

// 创建用户
export function creatUser(data) {
  return request({
    url: '/back/users/creat',
    method: 'post',
    data
  })
}

// 修改用户
export function editUser(data) {
  return request({
    url: '/back/users/update',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/back/users/delete/' + id,
    method: 'delete'
  })
}






// 退出登录 
export function logout() {
  return request({
    url: '/backstage/loginOut',
    method: 'get'
  })
}

// 查询权限路由
export function getPermissionRoutes() {
  return request({
    url: '/backstage/routingTable',
    method: 'get'
  })
}
