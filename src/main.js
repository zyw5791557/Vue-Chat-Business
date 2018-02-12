import babelpolyfill from 'babel-polyfill';
import Vue from 'vue';
import App from './App';

// 引入 Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入 Muse UI 
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-carbon.css' // 使用 carbon 主题
Vue.use(MuseUI);

// 引入已配置的 Vuex 仓库
import store from './store';
Vue.use(store);

// 进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
Vue.prototype.$NProgress = NProgress;

// 引入路由配置
import router from './router';

// 引入自定义插件 - API 接口
import api from './api';
Vue.use(api);

// 配置文件
import config from './config';


// 连接到远程socket地址。
import io from 'socket.io-client';
import SocketClient from './socket-client';
const SOCKET_URL = config.$SOCKET_URL;
const socket = io.connect(SOCKET_URL, {
	reconnection : true
});

Vue.prototype.$socket = socket;

Vue.prototype.$SocketClient = SocketClient;


// 资源服务器地址
Vue.prototype.$STATIC_URL = config.$STATIC_URL;

// 全局 axiosBaseURL
Vue.prototype.$BASE_URL = process.env.API_ROOT;
new Vue({
	router,
	store,
	created () {
		const self = this;
		SocketClient.connectOn(this);
		SocketClient.disconnectOn(this);
		SocketClient.checkPermissionOn(this);
		SocketClient.takeUserInfoOn(this, function (res) {
			if(res.Data.name === self.$store.state.userInfo.name) {
				self.$store.state.myPanel = res;
				self.$store.commit('UPDATE_USERSETTINGSTATE', true);
			}else {
				self.$store.state.userPanelInfo = res;
				self.$store.commit('UPDATE_USERPANELSTATE', true);
			}
			console.log('接收用户信息', res);
		});
	},
	render: h => h(App)
}).$mount('#app');