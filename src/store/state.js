/**
* @constant state - Vuex状态
* connectState			连接状态 | 默认 true
* userInfo				用户信息
* touristInfo			游客信息
* globalMask			全局蒙版
* expression			表情集合
*  - baidu					- 百度表情
* userSettingState		用户设置面板状态
* systemSettingState	系统设置面板状态
* userPanelState		用户面板状态
* roomNoticeState		聊天室消息窗口状态
* roomInfoState			聊天室信息窗口状态
* expressionState		表情界面状态
* codeInputState		代码输入窗口状态
* contactsPanelState	联系人
**/

const state = {
	connectState: true,
	userInfo: JSON.parse(localStorage.getItem('UserInfo')),
	touristInfo: JSON.parse(localStorage.getItem('TouristInfo')),
	globalMask: false,
	lyricState: false,
	userSettingState: false,
	systemSettingState: false,
	userPanelState: false,
	roomNoticeState: false,
	roomInfoState: false,
	expressionState: false,
	codeInputState: false,
	contactsPanelState: false,
	expression: {
		baidu: {
			space: 30,
			address: '/images/expressions/baidu.png',
			data: [
				'呵呵', '哈哈', '吐舌', '啊', '酷', '怒', '开心', '汗', '泪', '黑线',
				'鄙视', '不高兴', '真棒', '钱', '疑问', '阴险', '吐', '咦', '委屈', '花心',
				'呼', '笑眼', '冷', '太开心', '滑稽', '勉强', '狂汗', '乖', '睡觉', '惊哭',
				'升起', '惊讶', '喷', '爱心', '心碎', '玫瑰', '礼物', '彩虹', '星星月亮', '太阳',
				'钱币', '灯泡', '咖啡', '蛋糕', '音乐', 'haha', '胜利', '大拇指', '弱', 'ok',
			]
		},
	}
};

export default state;