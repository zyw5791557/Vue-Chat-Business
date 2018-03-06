<script>
import { touristTips } from '@/common/js/util.js';
import UserSettingModule from '@/components/UserSettingModule';
import SystemSettingModule from '@/components/SystemSettingModule';
export default {
    /**
     * @function
     * touristTips              游客提示
     * 
     * @components  - 组件注册
     * UserSettingModule        用户设置
     * SystemSettingModule      系统设置
     * 
     * @data        - 状态
     * backgroundSize           背景大小
     * weatherCase              天气状态
     * 
     * @computed    - 计算属性
     * myPanel                  我的面板信息
     * systemConfig             系统设置配置项
     * connectState             连接状态
     * userInfo                 用户信息
     * mask                     全局蒙版
     * userSettingState         用户设置窗口状态
     * systemSettingState       系统设置窗口状态
     * lyricState               歌词状态
     * 
     * @methods     - 方法
     * initBackgroundSize       初始化背景大小设置
     * winResize                窗口调整事件处理
     * clearPanel               清除所有面板状态
     * userInfoUpdate           更新用户信息
     * getMyPanel               获取用户面板
     * unfinished               未完成提示
     * logout                   注销
     * 
     * @created     - 实例创建完成后被调用
     * SOCKET_CHECK_PERMISSION_EMIT                     检查用户权限 | emit
     * SOCKET_USER_JOIN_EMIT                            用户加入 | emit
     * 
     * @mounted     - el 被 新创建 vm.$el 替代, 组件视图并不一定全部渲染完成
     * initBackgroundSize                               初始化 backgroundSize 的值
     * winResize                                        window.onresize 调整
     * playmusic   1.歌词显示节点 2.网易云歌单ID          音乐初始化 | 必须等节点加载完成
     * getApi | weather                                 请求天气接口      
     */
    name: 'Home',
    components: {
        UserSettingModule,
        SystemSettingModule
    },
	data() {
		return {
            backgroundSize: '',
            weatherCase: {
                currentCity: '',
                currentTemperature: '',
                temperature: '',
                weather: ''
            }
		}
    },
    computed: {
        myPanel () {
            return this.$store.state.myPanel;
        },
        systemConfig () {
            return this.$store.state.systemConfig;
        },
        connectState () {
            return this.$store.state.connectState;
        },
        userInfo () {
            return this.$store.state.userInfo || this.$store.state.touristInfo;
        },
        mask () {
            return this.$store.state.globalMask;
        },
        userSettingState () {
            return this.$store.state.userSettingState;
        },
        systemSettingState () {
            return this.$store.state.systemSettingState;
        },
        lyricState () {
            return this.$store.state.lyricState; 
        }
    },
	methods: {
        initBackgroundSize () {
            const w = document.body.clientWidth;
            const h = document.body.clientHeight;
            this.backgroundSize = `${w}px ${h}px`;
        },
        winResize () {
            window.onresize = () => {
                this.initBackgroundSize();
            };
        },
        clearPanel () {
            this.$store.commit('UPDATE_GLOBALMASK', false);
        },
        userInfoUpdate () {
            this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
        },
        getMyPanel () {
            if(this.$store.state.touristInfo !== null) return touristTips();
            this.$store.commit('SOCKET_TAKEUSERINFO_EMIT', this.userInfo.name);
        },
        unfinished () {
            this.$notify.info({ title: '消息', message: '暂未开放' });
        },
        logout () {
            this.$store.commit('SOCKET_LOGOUT_EMIT', this.userInfo.name);
            localStorage.removeItem('UserInfo');
            localStorage.removeItem('TouristInfo');
            this.$router.push({ name: 'Login' });
            this.$store.commit('UPDATE_SYSTEMSETTINGSTATE', false);
            this.$store.commit('SOCKET_DISCONNECT');
            this.$store.commit('CLEAR_HISTORY');
        },
    },
    created () {
        // 用户权限检查
        this.$store.commit('SOCKET_CHECK_PERMISSION_EMIT', this.userInfo.name);
        // 用户加入
        this.$store.commit('SOCKET_USER_JOIN_EMIT', this.userInfo.name);
    },
	mounted() {
        // 初始化 backgroundSize 的值
        this.initBackgroundSize();
        // window.onresize 调整
        this.winResize();
        // 音乐初始化 | 必须等节点加载完成
        playmusic('.description','432778620');
        this.getApi('weather').then(res => {
            this.weatherCase.currentCity = res.data.results[0].currentCity;
            this.weatherCase.temperature = res.data.results[0].weather_data[0].temperature;
            this.weatherCase.weather = res.data.results[0].weather_data[0].weather;
        });
	}
}
</script>

<template>
	<div class="chatroom">
		<div class="windows">
            <div :style="{ backgroundSize: backgroundSize }" class="background">
                <div :style="{ backgroundSize: backgroundSize }" class="background-mask"></div>
            </div>
            <div v-show="mask" @click="clearPanel" class="mask-layout"></div>
            <div class="chatRoom">
                <header>
                    <div class="logo">
                        <img src="https://assets.suisuijiang.com/images/logo.b3e14.png">
                    </div>
                    <div class="nav-list">
                        <div class="nav-list-item selected" title="聊天">
                            <i class="icon"></i>
                        </div>
                        <div @click="unfinished" class="nav-list-item " title="联系人">
                            <i class="icon"></i>
                        </div>
                        <div @click="$store.commit('UPDATE_SYSTEMSETTINGSTATE', true);" class="nav-list-item " title="系统设置">
                            <i class="icon"></i>
                        </div>
                    </div>
                    <div class="user-panel">
                        <div class="weather-box">
                            <p class="weather-city">{{ weatherCase.currentCity }}</p>
                            <p class="weather-temperature">{{ weatherCase.currentTemperature }}</p>
                            <p class="weather-case">{{ weatherCase.temperature }} {{ weatherCase.weather }}</p>
                        </div>
                        <div :class="{ offline: !connectState }" class="online" title="在线"></div>
                        <div :style="`background-image: url(${userInfo.avatar})`" @click="getMyPanel" class="avatar-text" title="查看个人信息"></div>
                    </div>
                </header>
                <router-view></router-view>
                <transition name="scale">
                    <user-setting-module 
                        v-show="userSettingState" 
                        :data="myPanel" 
                        @close="$store.commit('UPDATE_USERSETTINGSTATE', false);"
                        @updateAvtar="userInfoUpdate"
                    ></user-setting-module>
                </transition>
                <transition name="scale">
                    <system-setting-module 
                    v-show="systemSettingState" 
                    :data="systemConfig" 
                    @close="$store.commit('UPDATE_SYSTEMSETTINGSTATE', false);"
                    @logout="logout"
                    ></system-setting-module>
                </transition>
            </div>
        </div>
		<div v-show="lyricState" class="lyric_content">
            <div class="description"></div>
        </div>
	</div>
</template>

<style scoped lang="scss">
@import '../styles/transition.scss';
.chatroom {
	width: 100%;
    height: 100%;
}
.user-panel .weather-box {
    width: 200px;
    height: 100%;
    color: #fff;
    padding: 14px 0;
    text-align: center;
    p {
        line-height: 26px;
        font-size: 14px;
    }
    .weather-temperature {
        font-size: 18px;
    }
}
</style>
