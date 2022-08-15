

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import main from './modules/main';
import enumList from './modules/enum';
export default {
	modules:{
		main,
		enumList
	}
};
