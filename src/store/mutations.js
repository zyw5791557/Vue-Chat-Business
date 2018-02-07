import * as types from './mutation-types';

/**
 * @mutations
 * UPDATE_USERINFO		更新登录用户信息
 * UPDATE_TOURISTINFO	更新游客信息
 */

const mutations = {
	[types.UPDATE_USERINFO] (state, data) {
		state.userInfo = data;
	},
	[types.UPDATE_TOURISTINFO] (state, data) {
		state.touristInfo = data;
	}
};


export default mutations;