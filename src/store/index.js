import Vue from 'vue'
import Vuex from 'vuex'
import common from './common/index.js'
import container from './container/index.js'
Vue.use(Vuex)
export default new Vuex.Store({
  modules:{
    common,
    container
  }
});
