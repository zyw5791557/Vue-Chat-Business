<script>
/**@data - 状态
 * desktopNoticeLock        桌面提醒
 * desktopVoiceLock         桌面声音提醒
 * 
 * @computed - 计算属性
 * loadData                 系统设置数据
 * 
 * @methods - 方法
 * checkSetting             初始化系统设置
 * clearChatData            清除数据库聊天数据
 * desktopNotice            桌面通知修改
 * desktopVoice             桌面声音修改
 */
export default {
    name: 'SystemSettingModule',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            desktopNoticeLock: true,
            desktopVoiceLock: true
        }
    },
    computed: {
        loadData () {
            return this.data;
        }
    },
    methods: {
        checkSetting () {
            var d = JSON.parse(localStorage.getItem('desktopNotification'));
            var s = JSON.parse(localStorage.getItem('soundNotification'));
            if (d === null) {
                localStorage.setItem('desktopNotification', true);
            } else {
                if (d) {
                    this.desktopNoticeLock = true;
                } else {
                    this.desktopNoticeLock = false;
                }
            }
            if (s === null) {
                localStorage.setItem('soundNotification', true);
            } else {
                if (s) {
                    this.desktopVoiceLock = true;
                } else {
                    this.desktopVoiceLock = false;
                }
            }
        },
        clearChatData () {
            if(this.$store.state.userInfo.token) {
                this.$notify.error({
                    title: '错误',
                    message: '登录超时, 请两秒后重新登录。'
                });
                // 删除本地用户信息
                localStorage.removeItem('UserInfo');
                setTimeout(() => {
                    this.$router.push({ name: 'Login' });
                },2000);
                return;
            }
            // 清库询问
            this.$confirm("Are you sure you want to clear the app's data?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                //do something
                this.getApi('deleteChatData',{
                    method: 'POST',
                    data: {
                        user: this.$store.state.userInfo.name,
                        token: this.$store.state.userInfo.token,
                    }
                }).then(res => {
                    var code = res.data.Code;
                    var str = res.data.Str;
                    if(code === 0) {
                        this.$notify.success({
                            title: '成功',
                            message: str
                        });
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: str
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        desktopNotice () {
            this.desktopNoticeLock ? localStorage.setItem('desktopNotification', false) : localStorage.setItem('desktopNotification', true);
            this.desktopNoticeLock = !this.desktopNoticeLock;
        },
        desktopVoice () {
            this.desktopVoiceLock ? localStorage.setItem('soundNotification', false) : localStorage.setItem('soundNotification', true);
            this.desktopVoiceLock = !this.desktopVoiceLock;
        }
    },
    mounted () {
        this.checkSetting();
    }
}
</script>

<template>
    <!-- 系统设置 -->
    <div class="system-setting">
        <div>
            <span>系统设置</span>
            <i @click="$emit('close')" class="icon"></i>
        </div>
        <div>
            <div @click="desktopNotice" class="switch">
                <span>启用桌面通知</span>
                <div :class="{ on: desktopNoticeLock, off: !desktopNoticeLock }" class="switchBtn"></div>
            </div>
            <div @click="desktopVoice" class="switch">
                <span>启用声音通知</span>
                <div :class="{ on: desktopVoiceLock, off: !desktopVoiceLock }" class="switchBtn on"></div>
            </div>
            <a :href="loadData.SOURCE_CODE" class="button">
                <i class="icon"></i>
                <span>源码</span>
            </a>
            <a :href="loadData.WEB_SITE" class="button">
                <i class="icon"></i>
                <span>作者</span>
            </a>
            <a @click="$emit('logout')" class="button" id="logoutBtn">
                <i class="icon"></i>
                <span>登出</span>
            </a>
            <a 
                v-if="loadData.clearDataLock" 
                @click="clearChatData" 
                class="button" 
                id="clearData">
                <span>数据清理</span>
            </a>
        </div>
    </div>
</template>

