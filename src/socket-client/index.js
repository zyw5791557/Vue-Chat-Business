import {
    noticeProcess
} from '@/common/js/util.js';

/**
 * @function
 * desktopRemind                桌面提醒
 * noReadMsgRender              未读消息渲染
 */

function desktopRemind (res, $this) {
    console.log('桌面提醒啊啊啊', res);
    const storeUser = $this.$store.state.userInfo !== null ? $this.$store.state.userInfo.name : $this.$store.state.touristInfo.name;
    if (res[0].from !== storeUser) {
        var d = JSON.parse(localStorage.getItem('desktopNotification'));
        var s = JSON.parse(localStorage.getItem('soundNotification'));
        if (s) {
            // 消息声音提醒
            var ado = new Audio('/static/audio/momo.mp3');
            ado.play();
        }
        if (d) {
            // 桌面消息提醒
            Notification.requestPermission(function (permission) {
                if (permission == "granted") {
                    var notification = new Notification((res[0].to === 'all' ? "群聊窗口" : res[0].from) + "- 发来消息", {
                        dir: "auto",
                        lang: "zh-CN",
                        // tag: "testNotice",
                        icon: '/static/images/sleep.gif',
                        body: `${res[0].from}：${noticeProcess(res[0].message,res[0].type)}`,
                        // renotify: true,     // 是否替换之前的通知
                    });
                    notification.onclick = function () {
                        window.focus();
                        notification.close();
                    };
                    notification.onshow = function () {
                        //3秒后自动关闭消息框    
                        setTimeout(function () {
                            notification.close();
                        }, 3000);
                    }
                }
            });
        }
    }
}

function noReadMsgRender (res, $this) {
    /**
     *  from 来自谁的消息
     */
    const storeUser = $this.$store.state.userInfo !== null ? $this.$store.state.userInfo.name : $this.$store.state.touristInfo.name;
    const currentUser = $this.$store.state.currentChatUserInfo.userID;

    // 判断当前窗口是否为聊天渲染窗口, 若是调用渲染函数, 若不是, 直接跳走并 未读消息计数 ++ 
    if (currentUser !== '') {           // 如果当前频道不为空频道
        // 当前为私聊频道或群聊频道
        if (res[0].to == 'all' && currentUser !== 'all') {    // 如果是发送去群聊频道切当前不在群聊频道
            $this.$store.commit('UPDATE_MYUSERLISTARR', {
                addRead: true,
                userID: 'all'
            });
        } else {                     // 私聊频道
            if (res[0].to !== 'all' && res[0].from !== storeUser && currentUser !== res[0].from) {
                if($this.$store.state.myUserListArr[res[0].from] === undefined) {
                    $this.$store.commit('UPDATE_MYUSERLISTARR', {
                        key: res[0].from,
                        value: { noRead: 1 }
                    });
                } else {
                    $this.$store.commit('UPDATE_MYUSERLISTARR', {
                        addRead: true,
                        userID: res[0].from
                    });
                }
            }
        }
    } else {
        // 当前为空频道。
        if (res[0].to == 'all' && currentUser !== 'all') {    // 如果是发送去群聊频道切当前不在群聊频道
            $this.$store.commit('UPDATE_MYUSERLISTARR', {
                addRead: true,
                key: null,
                value: null,
                userID: 'all'
            });
        } else {                     // 私聊频道
            if (res[0].to !== 'all' && res[0].from !== storeUser && currentUser !== res[0].from) {
                if($this.$store.state.myUserListArr[res[0].from] === undefined) {
                    $this.$store.commit('UPDATE_MYUSERLISTARR', {
                        key: res[0].from,
                        value: { noRead: 1 }
                    });
                } else {
                    $this.$store.commit('UPDATE_MYUSERLISTARR', {
                        addRead: true,
                        userID: res[0].from
                    });
                }
            }
        }
    }

}



/**
 * @class 
 * SocketClient                 socket-client
 * 
 * @class SocketClient static funciton
 * initAll                      初始化所有客户端事件
 * connectOn                    监听连接状态
 * disconnectOn                 监听断线状态
 * userJoinOn                   用户加入 | on
 * takeMessageOn                获取历史消息 | on
 * messagesOn                   获取实时消息 | on
 * desktopRemind                桌面提醒 | on
 * takeUserInfoOn               获取用户信息 | on
 * checkPermissionOn            检查用户权限 | on
 * offlineNoReadMessagesOn      查看离线消息 | on
 */

class SocketClient {
    static initChat ($this) {
        this.connectOn($this);
        this.disconnectOn($this);
        this.checkPermissionOn($this);
        this.userJoinOn($this);
        this.takeUserInfoOn($this);
        this.takeMessageOn($this);
        this.messagesOn($this);
        this.desktopRemind($this);
        this.offlineNoReadMessagesOn($this);
        this.typingOn($this);
        this.stopTypingOn($this);
    }
    static connectOn ($this) {
        $this.$socket.on('connect',() => {
            $this.$store.commit('UPDATE_CONNECTSTATE', true);
        });
    }
    static disconnectOn ($this) {
        $this.$socket.on('disconnect',() => {
            $this.$store.commit('UPDATE_CONNECTSTATE', false);
        });
    }
    // 接受用户数
    static userJoinOn ($this) {
        $this.$socket.on('user join', data => {
            console.log(data)
            $this.$store.commit('UPDATE_ONLINEUSERS', data);
        });
    }
    // 接受历史记录
    static takeMessageOn ($this) {
        $this.$socket.on('take messages',  data => {
            console.log('历史记录：', data);
            $this.$store.commit('UPDATE_LOADING', false);
            $this.$store.commit('UPDATE_CURRENTCHATDATA',{
                concat: false,
                data: data
            });
            if(data.length > 0) $this.$store.commit('UPDATE_LATEST_MESSAGE', data[data.length - 1]);
        });
    }
    // 接收 message
    static messagesOn ($this) {
        $this.$socket.on('message', data => {
            console.log('消息',data);
            $this.$store.commit('UPDATE_LATEST_MESSAGE', data[0]);
            // 渲染未读消息
            noReadMsgRender(data, $this);
            const f = data[0].to === $this.$store.state.currentChatUserInfo.userID;
            const isMe = $this.$store.state.userInfo !== null ? $this.$store.state.userInfo.name : $this.$store.state.touristInfo.name;
            const isGroupChat = data[0].from === $this.$store.state.currentChatUserInfo.userID;
            if(f || (isMe && isGroupChat)) {
                $this.$store.commit('UPDATE_CURRENTCHATDATA',{
                    concat: true,
                    data: data
                });
            } else {
                let existFlag = false;
                $this.$store.state.userList.map(item => {
                    if(item.userID === data[0].from) {
                        existFlag = true;
                    }
                });
                const o = {
                    name: data[0].from,
                    userID: data[0].from,
                    avatar: data[0].avatar,
                    unread: 0,
                    messageInfo: {
                        message: data[0].message,
                        date: data[0].date
                    }
                }
                if(!existFlag && data[0].to !== 'all') {
                    $this.$store.commit('UPDATE_USERLIST',o);
                }
            }
        });
    }
    static desktopRemind ($this) {
        $this.$socket.on('desktopRemind', data => {
            // 桌面提醒
            desktopRemind(data, $this);
        });
    }
    // 接受用户名片
    static takeUserInfoOn ($this) {
        $this.$socket.on('take userInfo', res => {
            if(res.Data.name === $this.$store.state.userInfo.name) {
				$this.$store.state.myPanel = res;
				$this.$store.commit('UPDATE_USERSETTINGSTATE', true);
			}else {
				$this.$store.state.userPanelInfo = res;
				$this.$store.commit('UPDATE_USERPANELSTATE', true);
			}
			console.log('接收用户信息', res);
        });
    }
    // 权限检查
    static checkPermissionOn ($this) {
        $this.$socket.on('check permission', f => {
            console.log(f)
            if(f) {
                $this.$store.commit('DELETE_DB_MESSAGE', true);
            } else {
                $this.$store.commit('DELETE_DB_MESSAGE', false);
            }
        });
    }
    // 接受离线消息未读条数
    static offlineNoReadMessagesOn ($this) {
        $this.$socket.on('Offline noRead messages',  res => {
            console.log('渲染离线消息',res);
            const storeUser = $this.$store.state.userInfo !== null ? $this.$store.state.userInfo.name : $this.$store.state.touristInfo.name;
            const currentUser = $this.$store.state.currentChatUserInfo.userID;
            var fromArr = {};
            var fromList = {};
            if (res.length !== 0) {
                for (let i = 0; i < res.length; i++) {
                    if (fromList[res[i].from] === undefined) {
                        fromList[res[i].from] = [res[i]];
                    } else {
                        fromList[res[i].from].push(res[i])
                    }
                }
                for(var j in fromList) {
                    fromArr[j] = {
                        noRead: fromList[j].length,
                        lastMsg: fromList[j][fromList[j].length-1],
                    };
                }
                console.log(fromArr)
                for (var k in fromArr) {
                    if (currentUser !== k && k !== storeUser && k !== 'all') {
                        const o = {
                            name: fromArr[k].lastMsg.from,
                            userID: fromArr[k].lastMsg.from,
                            avatar: fromArr[k].lastMsg.avatar,
                            unread: 0,
                            messageInfo: {}
                        }
                        $this.$store.commit('UPDATE_USERLIST',o);
                        // 添加临时会话成员
                        $this.$set($this.$store.state.myUserListArr, k, { noRead: fromArr[k].noRead });
                        // 渲染最后一条消息(闭包)
                        (function(k) {
                            setInterval(() => {
                                $this.$store.commit('UPDATE_LATEST_MESSAGE', fromArr[k].lastMsg);
                            },0);
                        })(k)
                    }
                }
            }
        });
    }
    // typing 状态
    static typingOn ($this) {
        $this.$socket.on('typing', obj => {
            if($this.$store.state.userInfo.name === obj.to && $this.$store.state.currentChatUserInfo.userID === obj.from) {
                $this.$store.commit('UPDATE_TYPINGSTATE', true);
            }
        });
    }
    // stop typing 状态
    static stopTypingOn ($this) {
        $this.$socket.on('stop typing', obj => {
            if($this.$store.state.userInfo.name === obj.to && $this.$store.state.currentChatUserInfo.userID === obj.from) {
                $this.$store.commit('UPDATE_TYPINGSTATE', false);
            }
        });
    }
}


export default SocketClient;