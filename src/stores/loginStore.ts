const state = {
  role: '',
}
//更新角色
const mutations = {
  setRole(state, role: string) {
    state.role = role
  },
}
const actions = {
  updateRole({ commit }, role: string) {
    commit('setRole', role) // 使用 mutation 更新状态
  },
}
const getters = {
  role: (state) => state.role, // 获取当前角色
  isAdmin: (state) => state.role === 'ADMIN', // 示例：判断是否为管理员
}

export default {
  state,
  mutations,
  actions,
  getters,
}
