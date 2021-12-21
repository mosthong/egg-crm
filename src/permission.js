import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  // console.log('hasToken', hasToken);

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // 此处无roles，动态分配权限 固定义一个固定roles
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // console.log('hasRoles', store.getters.roles);
      if (hasRoles) {
        next()
      } else {
        try {
          // console.log('try-----------');
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          console.log('roles', roles);

          // 基于角色生成可访问的路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', [roles])
          // console.log('合成路由', store.getters.permission_routes);
          // console.log('异步路由', accessRoutes);
          
          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)
          router.options.routes = store.getters.permission_routes //必须加
          
          // hack方法以确保addRoutes是完整的
          // 设置replace:true，这样导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // console.log('error-----------');
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})