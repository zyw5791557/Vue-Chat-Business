<script>
import Date from '@/common/js/dateTools.js';
import { touristTips } from '@/common/js/util.js';
import PanelRoomNoticeModule from '@/components/PanelRoomNoticeModule';
import PanelRoomInfoModule from '@/components/PanelRoomInfoModule';
import PanelExpressionModule from '@/components/PanelExpressionModule';
import PanelUserInfoModule from '@/components/PanelUserInfoModule';
export default {
    /**
     * @function    - 函数
     * Date                     添加 Date 方法到 Date 原型中
     * touristTips              游客提示
     * 
     * @components  - 组件注册
     * PanelRoomNoticeModule    群聊公告面板
     * PanelRoomInfoModule      群聊信息面板
     * PanelExpressionModule    表情模块
     * PanelUserInfoModule      用户信息面板
     * 
     * @data        - 状态
     * userInfo                 用户信息
     * duration                 注册时长
     * onlineUsers              所用在线用户面板
     * myUserListArr            我的临时会话集合
     * currentChatData          当前聊天窗口的消息
     * chatGroup                群聊组
     * userList                 用户列表
     * currentChatUserInfo      当前聊天窗口用户信息
     * chatPanelFlag            聊天面板状态
     * secretPanel              是否为私聊窗口
     * loading                  loading
     * 
     * @watch       - 被监听的状态
     * currentChatData          变动 | 查阅
     * chatPanelFlag            变动 | 歌词状态
     * 
     * @computed    - 计算属性
     * userInfo                 用户信息
     * userPanelInfo            用户面板信息
     * userPanelState           用户信息面板状态
     * roomNoticeState          房间消息面板状态
     * roomInfoState            房间信息面板状态
     * expressionState          表情选择窗口状态
     * codeInputState           代码发送窗口状态
     * 
     * @methods     - 方法
     * userInfoUpdate           更新用户信息
     * loadChatPanel            加载聊天面板
     * unfinished               未完成提示
     * normalSmartProcess       消息智能处理
     * expressionProcess        表情处理
     * noticeProcess            消息提示工厂
     * userTip                  用户列表消息提示处理
     * sendMessage              发送消息
     * takeMessage              调取离线消息
     * getUserPanel             获取用户面板
     * chatPanelAdjust          调整聊天框位置
     * codeBlockAdjust          代码块格式化调整
     * imageAdjust              图片加载完成调整
     * imagePreview             图片预览
     * imgReader                截图上传
     * pasteMsg                 剪贴板消息
     * openContactsList         打开联系人列表
     * 
     * @created     - 实例创建后触发
     * socket.emit 'Offline noRead messages'        检查离线状态下的未读消息
     * 
     * @mounted     - el 被 vm.$el 替代, 组件视图并不一定渲染完成, 保证组件渲染完成请使用 nextTick
     * 初始化 socket-client 服务
     */
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
            chatGroup: ['all'],       
            chatPanelFlag: true,      
            secretPanel: false
        }
    },
    watch: {
        currentChatData (res) {
            // 朕已阅
            this.$store.commit('SOCKET_MESSAGE_READ_EMIT', {
                readUser: this.userInfo.name, 
                msgs: res
            });
            this.$nextTick(() => {
                this.chatPanelAdjust();
                this.codeBlockAdjust();
                this.imageAdjust();
                this.imagePreview();
            });
            this.userTip(res[res.length - 1]);
        },
        latestMessage (val) {
            this.userTip(val);
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
        userPanelInfo () {
            return this.$store.state.userPanelInfo;
        },

        onlineUsers () {
            return this.$store.state.onlineUsers;
        },

        myUserListArr () {
            return this.$store.state.myUserListArr;
        },

        currentChatData () {
            return this.$store.state.currentChatData;
        },

        currentChatUserInfo () {
            return this.$store.state.currentChatUserInfo;
        },

        userList () {
            return this.$store.state.userList;
        },

        latestMessage () {
            return this.$store.state.latestMessage;
        },

        loading () {
            return this.$store.state.loading;
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
        loadChatPanel (item) {
            console.log('加载聊天面板', item)
            console.log(this.chatGroup.indexOf(item.userID))
            if(item.userID === this.currentChatUserInfo.userID) return;
            if(this.myUserListArr[item.userID]) {
                this.$store.commit('UPDATE_MYUSERLISTARR', {
                    userID: item.userID
                });
            }
            this.$store.commit('UPDATE_LOADING', true);
            let existFlag = false;
            this.userList.map(obj => {
                if(obj.userID === item.userID) {
                    existFlag = true;
                }
            });
            if(!existFlag) {
                this.$store.commit('UPDATE_MYUSERLISTARR', {
                    key: item.userID,
                    value: { noRead: 0 },
                });
                this.$store.commit('UPDATE_USERLIST', item);
            }
            this.takeMessage({
                from: this.userInfo.name,
                take: item.userID
            });
            const { name, userID, avatar } = item;
            this.$store.commit('UPDATE_CURRENTCHATUSERINFO', item);
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
                console.log(param);
                return `
                    <div class="image">
                        <img data-original="/api/imgload?url=${param}" src="/api/imgload?url=${param}" onerror="this.src='/static/images/imgError.jpg'" style="max-height: 200px;">
                    </div>
                `;
            }
            // 单独剥离 gif 图
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
            this.$store.commit('SOCKET_MESSAGE_EMIT', msg);
            this[clear] = '';
            if(clear === 'code') this.$store.commit('UPDATE_CODEINPUTSTATE', false);
        },
        takeMessage (o) {
            this.$store.commit('SOCKET_TAKE_MESSAGES_EMIT', o);
        },
        getUserPanel (name) {
            if(this.$store.state.touristInfo !== null) return touristTips(this);
            if(name.slice(0,2) === '游客') return;
            if(name !== this.userInfo.name) {
                this.$store.commit('SOCKET_TAKEUSERINFO_EMIT', name);
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
        imagePreviewHandle () {
            return new Viewer(this.$refs.messageList, {
                url: 'data-original',
                toolbar: 4,
                // 过滤图片
                filter (image) {
                    if(
                        image.classList.contains('avatar-image') || 
                        image.classList.contains('expression-default-message') ||
                        image.classList.contains('gif-image')
                    ) return false;
                    return true;
                },
            });
        },
        imagePreview () {
            // 图片放大
            if(this.$refs.preview && this.$refs.preview.length !== 0) {
                let viewer = this.imagePreviewHandle();
                viewer.destroy();
                viewer = this.imagePreviewHandle();
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
                    this.$store.commit('SOCKET_MESSAGE_EMIT', msg);
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
        },
        openContactsList () {
            if(this.$store.state.touristInfo !== null) return touristTips(this);
            this.$store.commit('UPDATE_CONTACTSPANELSTATE', true);
        }
    },
    created () {
        // 检查离线状态下的未读消息, 初始化
        this.$store.commit('SOCKET_OFFLINE_NOREAD_MESSAGES_EMIT', this.userInfo.name);
    },
	mounted() {
        // Socket-Client
        this.$SocketClient.initChat(this);
    },
    updated () {
        
    }
}
</script>

<template>
    <div class="body">
        <div class="user-list">
            <mu-list-item @click="openContactsList" title="联系人"></mu-list-item>
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

