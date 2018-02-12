
/**
 * @function
 * desktopRemind                桌面提醒
 * noReadMsgRender              未读消息渲染
 */

function desktopRemind (res, $this) {
    console.log('桌面提醒啊啊啊');
    const storeUser = $this.$store.state.userInfo !== null ? $this.$store.state.userInfo.name : $this.$store.state.touristInfo.name;
    const cacheUser = $this.userInfo.name;
    const flag = storeUser === cacheUser;
    if (res[0].from !== $this.userInfo.name && flag) {
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
                        body: `${res[0].from}：${$this.noticeProcess(res[0].message,res[0].type)}`,
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
    
    var currentUser = $this.$store.state.currentChatUserInfo.userID;

    // 判断当前窗口是否为聊天渲染窗口, 若是调用渲染函数, 若不是, 直接跳走并 未读消息计数 ++ 
    if (currentUser !== '') {           // 如果当前频道不为空频道
        // 当前为私聊频道或群聊频道
        if (res[0].to == 'all' && currentUser !== 'all') {    // 如果是发送去群聊频道切当前不在群聊频道
            $this.$store.state.myUserListArr.all.noRead++;
        } else {                     // 私聊频道
            if (res[0].to !== 'all' && res[0].from !== $this.userInfo.name && currentUser !== res[0].from) {
                $this.$store.state.myUserListArr[res[0].from] === undefined ? $this.$set($this.$store.state.myUserListArr, res[0].from, { noRead: 1 }) : $this.$store.state.myUserListArr[res[0].from].noRead++;
            }
        }
    } else {
        // 当前为空频道。
        if (res[0].to == 'all' && currentUser !== 'all') {    // 如果是发送去群聊频道切当前不在群聊频道
            $this.$store.state.myUserListArr.all.noRead++;
        } else {                     // 私聊频道
            if (res[0].to !== 'all' && res[0].from !== $this.userInfo.name && currentUser !== res[0].from) {
                $this.$store.state.myUserListArr[res[0].from] === undefined ? $this.$set($this.$store.state.myUserListArr, res[0].from, { noRead: 1 }) : $this.$store.state.myUserListArr[res[0].from].noRead++;
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
 * userJoinEmit                 用户加入 | emit
 * userJoinOn                   用户加入 | on
 * takeMessageOn                获取历史消息 | on
 * messagesOn                   获取实时消息 | on
 * desktopRemind                桌面提醒 | on
 * takeUserInfoEmit             请求用户信息 | emit
 * takeUserInfoOn               获取用户信息 | on
 * checkPermissionOn            检查用户权限 | on
 * offlineNoReadMessagesOn      查看离线消息 | on
 */

class SocketClient {
    static initChat ($this) {
        this.userJoinEmit($this);
        this.userJoinOn($this);
        this.takeMessageOn($this);
        this.messagesOn($this);
        this.desktopRemind($this);
        this.offlineNoReadMessagesOn($this);
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
    // 用户加入
    static userJoinEmit ($this) {
        $this.$socket.emit('user join', $this.userInfo.name);
    }
    // 接受用户数
    static userJoinOn ($this) {
        $this.$socket.on('user join', data => {
            console.log(data)
            $this.$store.state.onlineUsers = data;
        });
    }
    // 接受历史记录
    static takeMessageOn ($this) {
        $this.$socket.on('take messages',  data => {
            console.log('历史记录：', data);
            $this.$store.state.loading = false;
            $this.$store.state.currentChatData = data;
            if(data.length >= 1) $this.userTip(data[data.length - 1]);
            $this.$nextTick(() => {
                $this.chatPanelAdjust();
                $this.codeBlockAdjust();
                $this.imageAdjust();
                $this.imagePreview();
            });
        });
    }
    // 接收 message
    static messagesOn ($this) {
        $this.$socket.on('message', data => {
            console.log('消息',data);
            // 渲染未读消息
            noReadMsgRender(data, $this);
            const f = data[0].to === $this.$store.state.currentChatUserInfo.userID;
            if(f) {
                $this.$store.state.currentChatData = $this.$store.state.currentChatData.concat(data);
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
                    messageInfo: {}
                }
                if(!existFlag && data[0].to !== 'all') {
                    $this.$store.state.userList.push(o);
                }
            }
            $this.$nextTick(() => {
                $this.userTip(data[0]);
                $this.chatPanelAdjust();
                $this.codeBlockAdjust();
                $this.imageAdjust();
                $this.imagePreview();
            });
        });
    }

    static desktopRemind ($this) {
        $this.$socket.on('desktopRemind', data => {
            // 桌面提醒
            desktopRemind(data, $this);
        });
    }

    // 请求用户名片
    static takeUserInfoEmit ($this,username) {
        $this.$socket.emit('take userInfo', username);
    }

    // 接受用户名片
    // static takeUserInfoOn ($this) {
    //     $this.$socket.on('take userInfo', res => {
    //         console.log(res);
    //         if(res.Data.name !== $this.userInfo.name) {
    //             $this.userPanelInfo = res;
    //         }else {
    //             $this.myPanel = res;
    //         }
    //     });
    // }

    // 接受用户名片
    static takeUserInfoOn ($this,callback) {
        $this.$socket.on('take userInfo', res => {
            callback(res)
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
            var currentUser = $this.$store.state.currentChatUserInfo.userID;
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
                    if (currentUser !== k && k !== $this.userInfo.name && k !== 'all') {
                        const o = {
                            name: fromArr[k].lastMsg.from,
                            userID: fromArr[k].lastMsg.from,
                            avatar: fromArr[k].lastMsg.avatar,
                            unread: 0,
                            messageInfo: {}
                        }
                        $this.$store.state.userList.push(o);
                        // 添加临时会话成员
                        $this.$set($this.$store.state.myUserListArr, k, { noRead: fromArr[k].noRead });
                        // 渲染最后一条消息
                        $this.userTip(fromArr[k].lastMsg)
                    }
                }
            }
        });
    }
}


export default SocketClient;