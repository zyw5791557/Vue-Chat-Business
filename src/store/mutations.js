import * as types from './mutation-types';

const mutations = {
	[types.UPDATE_USERINFO] (state, data) {
		state.userInfo = data;
	}
};


export default mutations;