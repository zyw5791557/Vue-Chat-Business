import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import * as getters from './getters';
import * as actions from './actions';
import mutations from './mutations';


Vue.use(Vuex);

const createStore = () => {
	return new Vuex.Store({
		state,
		getters,
		mutations,
		actions,
	});
}

export default createStore;