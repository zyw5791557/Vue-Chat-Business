/**
* @constant state - Vuex状态
**/

const state = {
	userInfo: JSON.parse(localStorage.getItem('UserInfo')),
	touristInfo: JSON.parse(localStorage.getItem('TouristInfo')),
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