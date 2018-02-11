<script>
import { touristTips } from '@/common/js/util.js';
import UserSettingModule from '@/components/UserSettingModule';
import SystemSettingModule from '@/components/SystemSettingModule';
import ContactsModule from '@/components/ContactsModule';
export default {
    /**
     * @function
     * touristTips              游客提示
     * 
     * @components  - 组件注册
     * UserSettingModule        用户设置
     * SystemSettingModule      系统设置
     * ContactsModule           联系人模块
     * 
     * @data        - 状态
     * myPanel                  我的面板信息
     * systemConfig             系统设置配置项
     * 
     * @computed    - 计算属性
     * connectState             连接状态
     * userInfo                 用户信息
     * mask                     全局蒙版
     * userSettingState         用户设置窗口状态
     * systemSettingState       系统设置窗口状态
     * lyricState               歌词状态
     * contactsPanelLock        联系人面板状态
     * 
     * @methods     - 方法
     * initBackgroundSize       初始化背景大小设置
     * clearPanel               清除所有面板状态
     * userInfoUpdate           更新用户信息
     * getMyPanel               获取用户面板
     * unfinished               未完成提示
     * logout                   注销
     * 
     * @created     - 实例创建完成后被调用
     * socket.emit 'check permission'       检查用户权限
     * 
     * @mounted     - el 被 新创建 vm.$el 替代, 组件视图并不一定全部渲染完成
     * 初始化 socket.client 相应服务
     * playmusic                            音乐初始化
     */
    name: 'Home',
    components: {
        UserSettingModule,
        SystemSettingModule,
        ContactsModule
    },
	data() {
		return {
            myPanel: {},
            systemConfig: {
                SOURCE_CODE: 'https://github.com/zyw5791557/EmliceChat',
                WEB_SITE: 'https://www.emlice.top',
                clearDataLock: true
            }
		}
    },
    watch: {
        currentChatData (res) {
            // 朕已阅
            this.$socket.emit('message read', { readUser: this.userInfo.name, msgs: res });
        }
    },
    computed: {
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
        },
        contactsPanelLock () {
            return this.$store.state.contactsPanelState;
        }
    },
	methods: {
        initBackgroundSize () {
            const w = document.body.clientWidth;
            const h = document.body.clientHeight;
            return `background-size: ${w}px ${h}px`
        },
        clearPanel () {
            this.$store.commit('UPDATE_GLOBALMASK', false);
        },
        userInfoUpdate () {
            this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
        },
        getMyPanel () {
            if(this.$store.state.touristInfo !== null) return touristTips(this);
            this.$store.commit('UPDATE_USERSETTINGSTATE', true);
            this.$socket.emit('take userInfo', this.userInfo.name);
        },
        unfinished () {
            this.$notify.info({ title: '消息', message: '暂未开放' });
        },
        logout () {
            this.$socket.emit('logout', this.userInfo.name);
            localStorage.removeItem('UserInfo');
            localStorage.removeItem('TouristInfo');
            this.$router.push({ name: 'Login' });
            this.$store.commit('UPDATE_SYSTEMSETTINGSTATE', false);
            this.$socket.disconnect();
        }
    },
    created () {
        // 用户权限检查
        this.$socket.emit('check permission', this.userInfo.name);
    },
	mounted() {
        // Socket-Client
        const socketClient = new this.$SocketClient();
        socketClient.takeUserInfoOn(this);
        socketClient.checkPermissionOn(this);
        socketClient.connectOn(this);
        socketClient.disconnectOn(this);
        // 音乐初始化 | 必须等节点加载完成
        playmusic('.description','432778620');
	}
}
</script>

<template>
	<div class="chatroom">
		<div class="windows">
            <div :style="initBackgroundSize()" class="background">
                <div :style="initBackgroundSize()" class="background-mask"></div>
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

        <contacts-module :lock="contactsPanelLock"></contacts-module>

	</div>
</template>

<style scoped lang="scss">
@import '../styles/transition.scss';
.chatroom {
	width: 100%;
    height: 100%;
}
</style>
