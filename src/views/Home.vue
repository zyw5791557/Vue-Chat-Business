<script>
import { touristTips } from '@/common/js/util.js';
import SocketClient from '@/socket-client';
import UserSettingModule from '@/components/UserSettingModule';
import SystemSettingModule from '@/components/SystemSettingModule';
import ContactsModule from '@/components/ContactsModule';
export default {
    /**@components  - 组件注册
     * UserSettingModule        用户设置
     * SystemSettingModule      系统设置
     * PanelRoomNoticeModule    群聊公告面板
     * PanelRoomInfoModule      群聊信息面板
     * PanelExpressionModule    表情模块
     * PanelUserInfoModule      用户信息面板
     * ContactsModule           联系人模块
     * 
     * @data        - 状态
     * userInfo                 用户信息
     * myPanel                  我的面板信息
     * duration                 注册时长
     * onlineUsers              所用在线用户面板
     * myUserListArr            我的临时会话集合
     * currentChatData          当前聊天窗口的消息
     * chatGroup                群聊组
     * userList                 用户列表
     * userPanelInfo            用户面板信息
     * systemConfig             系统设置配置项
     * userSettingFlag          用户设置窗口状态
     * systemSettingFlag        系统设置窗口状态
     * chatPanelFlag            聊天窗口状态
     * roomNoticeFlag           群聊公告窗口状态
     * roomInfoFlag             群聊信息窗口状态
     * expressionFlag           表情输入窗口状态
     * secretPanel              私聊 / 群聊标志位
     * codeInputFlag            代码输入窗口状态
     * userPanelFlag            用户面板窗口状态
     * loading                  loading
     * contactsPanelLock        联系人面板锁
     * 
     * @computed    - 计算属性
     * mask                     全局蒙版
     * 
     * @methods     - 方法
     * loadChatData             加载离线消息
     * clearPanel               清除所有面板状态
     * userInfoUpdate           更新用户信息
     * loadChatPanel            加载聊天面板
     * unfinished               未完成提示
     * normalSmartProcess       消息智能处理
     * noticeProcess            消息提示工厂
     * userTip                  用户列表消息提示处理
     * sendMessage              发送消息
     * takeMessage              调取离线消息
     * logout                   注销
     * getUserPanel             获取用户面板
     * chatPanelAdjust          调整聊天框位置
     * codeBlockAdjust          代码块格式化调整
     * imageAdjust              图片加载完成调整
     * imgReader                截图上传
     * pasteMsg                 剪贴板消息
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
            duration: ~~localStorage.getItem('Duration'),
            systemConfig: {
                SOURCE_CODE: 'https://github.com/zyw5791557/EmliceChat',
                WEB_SITE: 'https://www.emlice.top',
                clearDataLock: true
            },
            userSettingFlag: false,
            systemSettingFlag: false,
            loading: true,
            contactsPanelLock: false
		}
    },
    watch: {
        currentChatData (res) {
            // 朕已阅
            socket.emit('message read', { readUser: this.userInfo.name, msgs: res });
        },
        userSettingFlag (val) {
            this.$store.commit('UPDATE_GLOBALMASK', val);
        },
        systemSettingFlag (val) {
            this.$store.commit('UPDATE_GLOBALMASK', val);
        }
    },
    computed: {
        userInfo () {
            return this.$store.state.userInfo || this.$store.state.touristInfo;
        },
        mask () {
            return this.$store.state.globalMask;
        },
        lyricState () {
            return this.$store.state.lyricState; 
        }
    },
	methods: {
        clearPanel () {
            this.userSettingFlag = false;
            this.systemSettingFlag = false;
            this.$store.commit('UPDATE_GLOBALMASK', false);
        },
        userInfoUpdate () {
            this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
        },
        getMyPanel () {
            if(this.$store.state.touristInfo !== null) return touristTips(this);
            this.userSettingFlag = true;
            socket.emit('take userInfo', this.userInfo.name);
        },
        unfinished () {
            this.$notify.info({ title: '消息', message: '暂未开放' });
        },
        logout () {
            socket.emit('logout', this.userInfo.name);
            localStorage.removeItem('UserInfo');
            localStorage.removeItem('TouristInfo');
            this.$router.push({ name: 'Login' });
        }
    },
    created () {
        // 用户权限检查
        socket.emit('check permission', this.userInfo.name);
    },
	mounted() {
        SocketClient.takeUserInfoOn(this);
        SocketClient.checkPermissionOn(this);
        // 音乐初始化 | 必须等节点加载完成
        playmusic('.description','432778620');
	}
}
</script>

<template>
	<div class="chatroom">
		<div class="windows">
            <div class="background">
                <div style="background-size: 1920px 1030px;background-image: url('/static/images/b.jpg');"></div>
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
                        <div @click="systemSettingFlag = true" class="nav-list-item " title="系统设置">
                            <i class="icon"></i>
                        </div>
                    </div>
                    <div class="user-panel">
                        <div class="online" title="在线"></div>
                        <div :style="`background-image: url(${userInfo.avatar})`" @click="getMyPanel" class="avatar-text" title="查看个人信息"></div>
                    </div>
                </header>
                <router-view></router-view>
                <transition name="scale">
                    <user-setting-module 
                        v-show="userSettingFlag" 
                        :data="myPanel" 
                        @close="userSettingFlag = false"
                        @updateAvtar="userInfoUpdate"
                    ></user-setting-module>
                </transition>
                <transition name="scale">
                    <system-setting-module 
                    v-show="systemSettingFlag" 
                    :data="systemConfig" 
                    @close="systemSettingFlag = false"
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
