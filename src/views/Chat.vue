<script>
import Date from '@/common/js/dateTools.js';
import { touristTips } from '@/common/js/util.js';
import SocketClient from '@/socket-client';
import PanelRoomNoticeModule from '@/components/PanelRoomNoticeModule';
import PanelRoomInfoModule from '@/components/PanelRoomInfoModule';
import PanelExpressionModule from '@/components/PanelExpressionModule';
import PanelUserInfoModule from '@/components/PanelUserInfoModule';
export default {
    name: 'Chat',
    components: {
        PanelRoomNoticeModule,
        PanelRoomInfoModule,
        PanelExpressionModule,
        PanelUserInfoModule,  
    },
    data () {
        return {
            message: '',
            code: '',
            myPanel: {},
            onlineUsers: '',
            myUserListArr: {
                all: {
                    noRead: 0
                },
            },
            currentChatData: [],
            chatGroup: ['all'],
            userList: [
                {
                    name: '群聊',
                    userID: 'all',
                    avatar: '/static/images/sleep.gif',
                    unread: 0,
                    messageInfo: {
                        message: '',
                        date: ''
                    }
                }
            ],
            currentChatUserInfo: {
                name: '',
                userID: '',
                avatar: ''
            },
            userPanelInfo:  {},
            systemConfig: {
                SOURCE_CODE: 'https://github.com/zyw5791557/EmliceChat',
                WEB_SITE: 'https://www.emlice.top',
                clearDataLock: true
            },
            chatPanelFlag: true,
            secretPanel: false,
            loading: true,
            contactsPanelLock: false
        }
    },
    watch: {
        currentChatData (res) {
            // 朕已阅
            socket.emit('message read', { readUser: this.userInfo.name, msgs: res });
        },
        chatPanelFlag (val) {
            // 更新仓库歌词状态
            this.$store.commit('UPDATE_LYRICSTATE', !this.chatPanelFlag);
        }
    },
    computed: {
        userInfo () {
            return this.$store.state.userInfo || this.$store.state.touristInfo;
        },
        userPanelState () {
            return this.$store.state.userPanelState;
        },
        roomNoticeState () {
            return this.$store.state.roomNoticeState;
        },
        roomInfoState () {
            return this.$store.state.roomInfoState;
        },
        expressionState () {
            return this.$store.state.expressionState;
        },
        codeInputState () {
            return this.$store.state.codeInputState;
        },
    },
    methods: {
        userInfoUpdate () {
            this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
        },
        getMyPanel () {
            if(this.$store.state.touristInfo !== null) return touristTips(this);
            this.userSettingFlag = true;
            socket.emit('take userInfo', this.userInfo.name);
        },
        loadChatPanel (item) {
            console.log('加载聊天面板', item)
            console.log(this.chatGroup.indexOf(item.userID))
            if(item.userID === this.currentChatUserInfo.userID) return;
            if(this.myUserListArr[item.userID])this.myUserListArr[item.userID].noRead = 0;
            this.loading = true;
            let existFlag = false;
            this.userList.map(item => {
                if(item.userID === item.userID) {
                    existFlag = true;
                }
            });
            if(!existFlag) this.userList.push(item);
            this.takeMessage({
                from: this.userInfo.name,
                take: item.userID
            });
            const { name, userID, avatar } = item;
            this.currentChatUserInfo.name = name;
            this.currentChatUserInfo.userID = userID;
            this.currentChatUserInfo.avatar = avatar;
            if(this.chatGroup.indexOf(item.userID) !== -1) {
               this.chatPanelFlag = false; 
                this.secretPanel = false;
            }else {
               this.chatPanelFlag = false; 
                this.secretPanel = true;
            }
            this.$nextTick(() => {
                this.$refs.inputMsg.focus();
            });
        },
        unfinished () {
            this.$notify.info({ title: '消息', message: '暂未开放' });
        },
        normalSmartProcess (param, type) { 
            var FTA = param.match(/^(https?|ftp|file):\/\//g);
            var f = param.match(/.*(\.png|\.jpg|\.jpeg)$/);
            var gf = param.match(/.*(\.gif)$/);
            // 远程图片链接解析, 接口反防盗链
            if(FTA !== null && f !== null) {
                return `
                    <div class="image">
                        <img data-original="/api/imgload?url=${param}" src="/api/imgload?url=${param}" onerror="this.src='/static/images/imgError.jpg'" style="max-height: 200px;">
                    </div>
                `;
            }
            // 单独玻璃 gif 图
            if(FTA !== null && gf !== null) {
                return `
                    <div class="image">
                        <img class="gif-image" data-original="/api/imgload?url=${param}" src="/api/imgload?url=${param}" onerror="this.src='/static/images/imgError.jpg'" style="max-height: 200px;">
                    </div>
                `;
            }
            // 渲染链接
            if (FTA !== null) {
                return `
                    <div class="text">
                        <a class="imageURL" href="${param}" rel="noopener noreferrer" target="_blank">${param}</a>
                    </div>
                `;
            } else {
                return `
                    <div class="text">
                        ${param}
                    </div>
                `;
            }
        },
        expressionProcess (item) {
            const baidu = this.$store.state.expression.baidu.data;
            const baidu_space = this.$store.state.expression.baidu.space;
            const baidu_address = this.$STATIC_URL + this.$store.state.expression.baidu.address;
            let query;
            if(item.type === 'expression') {
                query = item.message;
            }else {
                query = item.message.substr(1);
            }
            let baidu_idx;
            baidu.some((item, index) => {
                if (item === query) {
                    baidu_idx = index;
                }
            });
            if(baidu_idx === undefined) return item.message;
            return  `<img 
                        class="expression-default-message" 
                        src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==" 
                        style="background-position: left -${baidu_idx * baidu_space}px; background-image: url(${baidu_address})" 
                        onerror="this.style.display='none'">`
        },
        noticeProcess (param,type) {
            const baidu = this.$store.state.expression.baidu.data;
            if (type === 'expression') {
                var baidu_idx;
                baidu.some((item, index) => {
                    if (item === param) {
                        baidu_idx = index;
                    }
                });
                if (baidu_idx === undefined) return param;
                return `[表情]`;
            } else if (type === 'printscreen') {
                return `[图片]`;
            } else if(type === 'code') {
                return `[代码片段]`;
            } else {
                var FTA = param.match(/^(https?|ftp|file):\/\//g);
                var f = param.match(/.*(\.png|\.jpg|\.jpeg|\.gif)$/);
                if(FTA !== null && f !== null) return `[远程地址图片]`;
                if(FTA !== null) return `[链接]`; 
                return param;
            }
        },
        userTip (last) {
            console.log('小提示',last)
            if(last.to === 'all') {
                this.userList.find(item => {
                    if(item.userID === last.to) {
                        this.$set(item.messageInfo, 'message', last.from + '： ' + this.noticeProcess(last.message,last.type));
                        this.$set(item.messageInfo, 'date', new Date(last.date).format('hh:mm'));
                        return;
                    }
                });
            } else {
                this.userList.find(item => {
                    if(item.userID === last.from || item.userID === last.to) {
                        this.$set(item.messageInfo, 'message', last.from + '： ' + this.noticeProcess(last.message,last.type));
                        this.$set(item.messageInfo, 'date', new Date(last.date).format('hh:mm'));
                        return;
                    }
                });
            }
            
        },
        sendMessage (message,type,clear) {
            var msg = {
                from: this.userInfo.name,
                avatar: this.userInfo.avatar,
                to: this.currentChatUserInfo.userID,
                message: message,
                type: type,
                date: new Date().getTime(),
                read: false,
            }
            console.log('消息', msg);
            socket.emit('message', msg);
            this[clear] = '';
            if(clear === 'code') this.$store.commit('UPDATE_CODEINPUTSTATE', false);
        },
        takeMessage (o) {
            socket.emit('take messages', o);
        },
        logout () {
            socket.emit('logout', this.userInfo.name);
            localStorage.removeItem('UserInfo');
            localStorage.removeItem('TouristInfo');
            this.$router.push({ name: 'Login' });
        },
        getUserPanel (name) {
            if(this.$store.state.touristInfo !== null) return touristTips(this);
            if(name.slice(0,2) === '游客') return;
            if(name !== this.userInfo.name) {
                this.$store.commit('UPDATE_USERPANELSTATE', true);
                socket.emit('take userInfo', name);
            }else {
                return;
            }
        },
        chatPanelAdjust () {
            if(!this.$refs.messageList) return;
            this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight;
        },
        codeBlockAdjust () {
            if(!this.$refs.codeBlock) return;
            for(let i = 0; i < this.$refs.codeBlock.length;i++) {
                hljs.highlightBlock(this.$refs.codeBlock[i]);
            }
        },
        imageAdjust () {
            if(!this.$refs.messageList) return;
            /**
             * 创建 imagesLoaded 实例
             * 确保 image 加载完毕改变聊天室 scrollTop
             */
            if (!this.$refs.messageList) return;
            const imgLoad = imagesLoaded(this.$refs.messageList);
            // vanilla JS
            imgLoad.on('always',  instance => {
                console.log('加载完成')
                this.chatPanelAdjust();
            });
            /**@function    每个图片加载后触发窗口调整
             * @augments
             * instance     图像加载实例
             * image        加载图像的 LoadingImage 实例
             */
            imgLoad.on( 'progress', ( instance, image ) => {
                this.chatPanelAdjust();
            });
        },
        imagePreview () {
            // 图片放大
            if(this.$refs.preview) {
                new Viewer(this.$refs.messageList, {
                    url: 'data-original',
                    toolbar: 4,
                    // 过滤图片
                    filter(image) {
                        if(
                            image.classList.contains('avatar-image') || 
                            image.classList.contains('expression-default-message') ||
                            image.classList.contains('gif-image')
                        ) return false;
                        return true;
                    },
                });
            }
        },
        imgReader (item) {
            var blob = item.getAsFile();
            if (blob !== null && blob.size > 1.5 * 1024 * 1024) {
                this.$notify.error({
                    title: '错误',
                    message: '图片太大, 请压缩后重新上传~'
                });
                return;
            } else if (blob === null) {
                this.$notify.error({
                    title: '错误',
                    message: '请截图重新上传~'
                });
                return;
            }
            var param = new FormData();
            param.append("ps", blob);
            this.getApi('printscreen',{
                method: 'POST',
                data: param,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(res => {
                var Code = res.data.Code;
                var Str = res.data.Str;
                if (Code === 0) {
                    var d = res.data.ps;
                    var to = this.currentChatUserInfo.userID;
                    var msg = {
                        from: this.userInfo.name,
                        avatar: this.userInfo.avatar,
                        to: to,
                        message: `${d}`,
                        type: 'printscreen',
                        date: new Date().getTime(),
                        read: false,
                    }
                    socket.emit('message', msg);
                } else if (Code === -1) {
                    this.$notify.error({
                        title: '错误',
                        message: Str
                    });
                    return;
                }
            });
        },
        pasteMsg ($event) {
            const items = ($event.clipboardData || $event.originalEvent.clipboardData).items;
            const types = ($event.clipboardData || $event.originalEvent.clipboardData).types;
            // 如果包含文件内容
            if (types.indexOf('Files') > -1) {
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    if (item.kind === 'file' && item.type.match(/^image/)) {
                        this.imgReader(item);
                    }
                }
                $event.preventDefault();
            }
        }
    },
    created () {
        // 用户权限检查
        socket.emit('check permission', this.userInfo.name);
        // 检查离线状态下的未读消息, 初始化
        socket.emit('Offline noRead messages', this.userInfo.name);
    },
	mounted() {
        SocketClient.initAll(this);
	},
    updated() {
        console.log('更新了');
    }
}
</script>

<template>
    <div class="body">
        <div class="user-list">
            <mu-list-item @click="contactsPanelLock = !contactsPanelLock" title="联系人"></mu-list-item>
            <div v-for="(item,index) in userList" :key="index" @click="loadChatPanel(item)" class="user-list-item" :data-user="item.userID">
                <img class="avatar-image" :src="item.avatar" alt="">
                <div class="unread">{{ myUserListArr[item.userID].noRead }}</div>
                <div class="content">
                    <div>
                        <p>{{ item.name }}</p>
                        <p>{{ item.messageInfo.date }}</p>
                    </div>
                    <div>
                        <p>{{ item.messageInfo.message }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="chatPanelFlag" class="empty-chat-panel" chat-type="empty"></div>
        <div v-else class="chat-panel" chat-type="">
            <div class="chat-panel-header">
                <div>
                    <img class="avatar-image" :src="currentChatUserInfo.avatar" style="width: 40px; height: 40px; min-width: 40px; min-height: 40px;">
                    <p>{{ currentChatUserInfo.name }}</p>
                </div>
                <div v-if="!secretPanel">
                    <div @click="$store.commit('UPDATE_ROOMNOTICESTATE', true);" style="margin: auto 8px;" class="roomNotice">
                        <i class="icon" title="公告"></i></div>
                    <div @click="$store.commit('UPDATE_ROOMINFOSTATE', true);" style="margin: auto 8px;" class="roomInfo">
                        <i class="icon" title="关于"></i></div>
                </div>
            </div>
            <div 
                ref="messageList" 
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.2)"
                class="message-list">
                <div v-for="(item,index) in currentChatData" :key="index" class="message-list-item">
                    <div :class="{ 'message-self': item.from === userInfo.name }" class="native-message">
                        <img class="avatar-image user-icon" :src="item.avatar" :alt="item.avatar" @click="getUserPanel(item.from)" :data-username="item.from">
                        <div>
                            <div>
                                <span class="message-username">{{ item.from }}</span>
                                <span>{{ (new Date(item.date).format('hh:mm:ss')) }}</span>
                            </div>
                            <template>
                                <div v-if="item.type === 'code'" ref="codeBlock" class="code"><pre><code>{{ item.message }}</code></pre></div>
                                <div v-else-if="(item.type === 'expression') || (item.message.charAt(0) === '#')" class="text">
                                    <div v-html="expressionProcess(item)"></div>
                                </div>
                                <div v-else-if="item.type === 'printscreen'" class="image" ref="preview">
                                    <img :data-original="item.message" :src="item.message" onerror="this.src='/images/imgError.jpg'" style="max-height: 200px;">
                                </div>
                                <div v-else v-html="normalSmartProcess(item.message, item.type)">
                                    
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="toolbar">
                <div @click="$store.commit('UPDATE_EXPRESSIONSTATE', true);">
                    <i class="icon" title="表情"></i>
                </div>
                <div @click="unfinished">
                    <i class="icon" title="图片"></i>
                </div>
                <div @click="$store.commit('UPDATE_CODEINPUTSTATE', true);">
                    <i class="icon" title="代码"></i>
                </div>
                <input type="file" class="image-input" accept="image/png,image/jpeg,image/gif">
            </div>
            <div class="input-box">
                <input 
                    ref="inputMsg" 
                    v-model="message" 
                    @keyup.enter="sendMessage(message,'normal','message')" 
                    @paste="pasteMsg"
                    type="text" 
                    placeholder="输入消息" 
                    maxlength="1024">
            </div>
            <template v-if="!secretPanel">
                <transition name="silde-rightIn">
                    <panel-room-notice-module 
                        v-show="roomNoticeState" 
                        @close="$store.commit('UPDATE_ROOMNOTICESTATE', false);">
                    </panel-room-notice-module>
                </transition>
                <transition name="silde-rightIn">
                    <panel-room-info-module 
                        v-show="roomInfoState"
                        :data="onlineUsers"
                        @startChat="getUserPanel"
                        @close="$store.commit('UPDATE_ROOMINFOSTATE', false);">
                    </panel-room-info-module>
                </transition>
            </template>
            <transition name="scale">
                <panel-expression-module 
                    v-show="expressionState" 
                    @send="sendMessage" 
                    @close="$store.commit('UPDATE_EXPRESSIONSTATE', false);"
                    @unfinished="unfinished"
                    ></panel-expression-module>
            </transition>
            <transition name="scale">
                <div v-show="codeInputState" class="code-input">
                    <textarea v-model="code" placeholder="输入要展示的代码"></textarea>
                    <div>
                        <button @click="sendMessage(code,'code','code')" class="sendCode">发送</button>
                        <button @click="$store.commit('UPDATE_CODEINPUTSTATE', false);" class="cancelCode">取消</button></div>
                </div>
            </transition>
            <transition name="scale">
                <panel-user-info-module 
                    v-show="userPanelState" 
                    :data="userPanelInfo" 
                    @chat="loadChatPanel" 
                    @close="$store.commit('UPDATE_USERPANELSTATE', false);">
                </panel-user-info-module>
            </transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../styles/transition.scss';

</style>

