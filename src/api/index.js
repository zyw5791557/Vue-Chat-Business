import axios from 'axios';
export default{
	install(Vue,options)
	{
		Vue.prototype.getApi = function (api,...arg) {
			const api_port = {
				// 登录
				login: '/api/login',
				// 注册
				register: '/api/register',
				// 修改用户信息
				userInfoEdit: '/api/userEdit',
				// 修改用户头像
				userAvatarUpdate: '/upload/avatar_upload',
				// 删除聊天数据
				deleteChatData: '/upload/clearData',
				// 截图上传
				'printscreen': '/upload/ps_upload'
			}
			let params = {};
			params.url = api_port[api];
			for ( let key in arg[0]) {
				params[key] = arg[0][key];
			};
			return axios(params);
		}
	}
}