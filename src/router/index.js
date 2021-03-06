// 引入依赖 Vue vue-router
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Login = resolve => require(['@/views/Login.vue'],resolve);
const Register = resolve => require(['@/views/Register.vue'],resolve);
const Home = resolve => require(['@/views/Home.vue'],resolve);
const Chat = resolve => require(['@/views/Chat.vue'],resolve);

const NotFound = resolve => require(['@/views/404.vue'],resolve);

let routes = [
    {
        path: '/home',
        component: Home,
        name: 'Home',
        children: [
            {
                path: 'chat',
                component: Chat,
                name: 'Chat'
            }
        ]
    },
    {
        path: '/',
        redirect: { path: '/home/chat' }
    },
    {
        path: '/login',
        component: Login,
        name: 'Login'
    },
    {
        path: '/register',
        component: Register,
        name: 'Register'
    },
    {
        path: '/404',
        component: NotFound,
    },
    {
        path: '*',
        component: NotFound,
    }
];

const router = new VueRouter({
	mode: 'history',       // 需要后台配置支持
	routes
});
router.beforeEach((to, from, next) => {
    // 获取仓库
    const Store = router.app.$store;
    let touristInfo = Store.state.touristInfo;
	if(to.path === '/home/chat' || to.path === '/home') {
		const user = localStorage.getItem('UserInfo') || touristInfo;
		if(!user) {
			next({ path: '/login' });
		}else {
			next();
		}
	}else {
		next();
	}
})

export default router;