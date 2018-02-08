import * as types from './mutation-types';

/**
 * @mutations
 * UPDATE_USERINFO						更新登录用户信息
 * UPDATE_TOURISTINFO					更新游客信息
 * UPDATE_GLOBALMASK					更新全局蒙版
 * UPDATE_LYRICSTATE					更新歌词状态
 * UPDATE_USERSETTINGSTATE				更新用户设置面板状态
 * UPDATE_SYSTEMSETTINGSTATE			更新系统设置面板状态
 * UPDATE_USERPANELSTATE				更新用户面板状态
 */

const mutations = {
	[types.UPDATE_USERINFO] (state, data) {
		state.userInfo = data;
	},
	[types.UPDATE_TOURISTINFO] (state, data) {
		state.touristInfo = data;
	},
	[types.UPDATE_GLOBALMASK] (state, boolean) {
		if(!boolean) {
			state.userPanelState = false;
		}
		state.globalMask = boolean;
	},
	[types.UPDATE_LYRICSTATE] (state, boolean) {
		state.lyricState = boolean;
	},
	[types.UPDATE_USERSETTINGSTATE] (state, boolean) {
		if(boolean) {
			state.globalMask = true;
		}
		state.userSettingState = boolean;
	},
	[types.UPDATE_SYSTEMSETTINGSTATE] (state, boolean) {
		if(boolean) {
			state.globalMask = true;
		}
		state.systemSettingState = boolean;
	},
	[types.UPDATE_USERPANELSTATE] (state, boolean) {
		if(boolean) {
			state.globalMask = true;
		}
		state.userPanelState = boolean;
	},
};


export default mutations;

