import { getCsrfToken, login, getInfo, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    name: '',
    roleName: '',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLENAME: (state, role_name) => {
    state.role_name = role_name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, passWord } = userInfo
    return new Promise((resolve, reject) => {
      getCsrfToken().then(res => {
        sessionStorage.setItem('csrf', res.csrfToken)

        login({ username: userName.trim(), password: passWord }).then(res => {
          const { data } = res
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve(data)
        }).catch(error => {
          reject(error)
        })

      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response.data

        if (!data) {  
          return reject('Verification failed, please Login again.')
        }
        
        commit('SET_ROLES', [data.roles])
        commit('SET_NAME', data.username)
        commit('SET_USER_ID', data.id)
        commit('SET_ROLENAME', data.systemRoles.roleName)

        resolve(data)

      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      // }).catch(error => {
        // reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

