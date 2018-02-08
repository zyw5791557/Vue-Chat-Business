
function desktopRemind (res, $this) {
    console.log('桌面提醒啊啊啊')
    if (res[0].from !== $this.userInfo.name) {
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
    
    var currentUser = $this.currentChatUserInfo.userID;

    // 判断当前窗口是否为聊天渲染窗口, 若是调用渲染函数, 若不是, 直接跳走并 未读消息计数 ++ 
    if (currentUser !== '') {           // 如果当前频道不为空频道
        // 当前为私聊频道或群聊频道
        if (res[0].to == 'all' && currentUser !== 'all') {    // 如果是发送去群聊频道切当前不在群聊频道
            $this.myUserListArr.all.noRead++;
        } else {                     // 私聊频道
            if (res[0].to !== 'all' && res[0].from !== $this.userInfo.name && currentUser !== res[0].from) {
                $this.myUserListArr[res[0].from] === undefined ? $this.$set($this.myUserListArr, res[0].from, { noRead: 1 }) : $this.myUserListArr[res[0].from].noRead++;
            }
        }
    } else {
        // 当前为空频道。
        if (res[0].to == 'all' && currentUser !== 'all') {    // 如果是发送去群聊频道切当前不在群聊频道
            $this.myUserListArr.all.noRead++;
        } else {                     // 私聊频道
            if (res[0].to !== 'all' && res[0].from !== $this.userInfo.name && currentUser !== res[0].from) {
                $this.myUserListArr[res[0].from] === undefined ? $this.$set($this.myUserListArr, res[0].from, { noRead: 1 }) : $this.myUserListArr[res[0].from].noRead++;
            }
        }
    }

}


class SocketClient {
    static initAll ($this) {
        this.userJoinEmit($this);
        this.userJoinOn($this);
        this.takeMessageOn($this);
        this.messagesOn($this);
        this.takeUserInfoOn($this);
        this.checkPermissionOn($this);
        this.offlineNoReadMessagesOn($this);
    }
    // 用户加入
    static userJoinEmit ($this) {
        socket.emit('user join', $this.userInfo.name);
    }
    // 接受用户数
    static userJoinOn ($this) {
        socket.on('user join', data => {
            console.log(data)
            $this.onlineUsers = data;
        });
    }
    // 接受历史记录
    static takeMessageOn ($this) {
        socket.on('take messages',  data => {
            console.log('历史记录：', data);
            $this.loading = false;
            $this.currentChatData = data;
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
        socket.on('message', data => {
            console.log('消息',data);
            // 渲染未读消息
            noReadMsgRender(data, $this);
            const f = data[0].to === $this.currentChatUserInfo.userID;
            if(f) {
                $this.currentChatData = $this.currentChatData.concat(data);
            } else {
                let existFlag = false;
                $this.userList.map(item => {
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
                if(!existFlag && data[0].to !== 'all') $this.userList.push(o);
            }
            $this.$nextTick(() => {
                $this.userTip(data[0]);
                $this.chatPanelAdjust();
                $this.codeBlockAdjust();
                $this.imageAdjust();
                $this.imagePreview();
            });
            // 桌面提醒
            desktopRemind(data, $this);
        });
    }
    // 接受用户名片
    static takeUserInfoOn ($this) {
        socket.on('take userInfo', res => {
            console.log(res);
            if(res.Data.name !== $this.userInfo.name) {
                $this.userPanelInfo = res;
            }else {
                $this.myPanel = res;
            }
        });
    }
    // 权限检查
    static checkPermissionOn ($this) {
        socket.on('check permission', f => {
            if(f) {
                $this.systemConfig.clearDataLock = false;
            }
        });
    }
    // 接受离线消息未读条数
    static offlineNoReadMessagesOn ($this) {
        socket.on('Offline noRead messages',  res => {
            console.log('渲染离线消息',res);
            var currentUser = $this.currentChatUserInfo.userID;
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
                        $this.userList.push(o);
                        // 添加临时会话成员
                        $this.$set($this.myUserListArr, k, { noRead: fromArr[k].noRead });
                        // 渲染最后一条消息
                        $this.userTip(fromArr[k].lastMsg)
                    }
                }
            }
        });
    }
}


export default SocketClient;