import { createStore } from 'vuex'
import menu from './menuStore'
import loginStore from './loginStore'

export default createStore({
  modules: {
    menu,
    loginStore,
  },
})
