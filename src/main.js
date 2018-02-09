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

import io from 'socket.io-client';

// 连接到远程socket地址。
// const SOCKET_URL = 'http://localhost:3000';
const socket = io.connect(SOCKET_URL, {
	forceNew: true,
	reconnection : true
});

Vue.prototype.$socket = socket;


// 资源服务器地址
Vue.prototype.$STATIC_URL = config.$STATIC_URL;

// 全局 axiosBaseURL
Vue.prototype.$BASE_URL = process.env.API_ROOT;
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');