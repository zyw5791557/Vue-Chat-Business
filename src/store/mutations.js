import * as types from './mutation-types';

/**
 * @mutations
 * UPDATE_CONNECTSTATE					更新连接状态
 * UPDATE_USERINFO						更新登录用户信息
 * UPDATE_TOURISTINFO					更新游客信息
 * UPDATE_GLOBALMASK					更新全局蒙版
 * UPDATE_LYRICSTATE					更新歌词状态
 * UPDATE_USERSETTINGSTATE				更新用户设置面板状态
 * UPDATE_SYSTEMSETTINGSTATE			更新系统设置面板状态
 * UPDATE_USERPANELSTATE				更新用户面板状态
 * UPDATE_ROOMNOTICESTATE       		更新聊天室消息窗口状态
 * UPDATE_ROOMINFOSTATE         		更新聊天室信息窗口状态
 * UPDATE_EXPRESSIONSTATE       		更新表情界面状态
 * UPDATE_CODEINPUTSTATE        		更新代码输入窗口状态
 * UPDATE_CONTACTSPANELSTATE			更新联系人面板
 * 
 * 
 * @function - 函数
 * CHECK_GLOBALMASK						检查全局蒙版状态
 */

function CHECK_GLOBALMASK($state) {
	if (
		$state.userSettingState ||
		$state.systemSettingState ||
		$state.userPanelState ||
		$state.roomNoticeState ||
		$state.roomInfoState ||
		$state.expressionState ||
		$state.codeInputState
	) {
		$state.globalMask = true;
	} else {
		$state.globalMask = false;
	}
}


const mutations = {

	[types.UPDATE_CONNECTSTATE](state, boolean) {
		state.connectState = boolean;
	},

	[types.UPDATE_USERINFO](state, data) {
		state.userInfo = data;
	},

	[types.UPDATE_TOURISTINFO](state, data) {
		state.touristInfo = data;
	},

	[types.UPDATE_GLOBALMASK](state, boolean) {
		if (!boolean) {
			state.userSettingState = false;
			state.systemSettingState = false;
			state.userPanelState = false;
			state.roomNoticeState = false;
			state.roomInfoState = false;
			state.expressionState = false;
			state.codeInputState = false;
		}
		state.globalMask = boolean;
	},

	[types.UPDATE_USERSETTINGSTATE](state, boolean) {
		state.userSettingState = boolean;
		CHECK_GLOBALMASK(state);

	},

	[types.UPDATE_SYSTEMSETTINGSTATE](state, boolean) {
		state.systemSettingState = boolean;
		CHECK_GLOBALMASK(state);
	},

	[types.UPDATE_USERPANELSTATE](state, boolean) {
		state.userPanelState = boolean;
		CHECK_GLOBALMASK(state);
	},

	[types.UPDATE_ROOMNOTICESTATE](state, boolean) {
		state.roomNoticeState = boolean;
		CHECK_GLOBALMASK(state);
	},

	[types.UPDATE_ROOMINFOSTATE](state, boolean) {
		state.roomInfoState = boolean;
		CHECK_GLOBALMASK(state);
	},

	[types.UPDATE_EXPRESSIONSTATE](state, boolean) {
		state.expressionState = boolean;
		CHECK_GLOBALMASK(state);
	},

	[types.UPDATE_CODEINPUTSTATE](state, boolean) {
		state.codeInputState = boolean;
		CHECK_GLOBALMASK(state);
	},

	[types.UPDATE_LYRICSTATE](state, boolean) {
		state.lyricState = boolean;
	},

	[types.UPDATE_CONTACTSPANELSTATE](state) {
		state.contactsPanelState = !state.contactsPanelState;
	},

};


export default mutations;

