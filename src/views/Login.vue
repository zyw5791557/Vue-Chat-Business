<script>
/**@data - 状态
 * tip              登录小提示
 * form             表单状态
 * 
 * @methods - 方法
 * login            登录
 * touristsLogin    游客登录
 * register         注册
 */

export default {
    name: 'Login',
    data () {
        return {
            tip: '滴滴,学生卡~',
            form: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            this.getApi('login',{
                method: 'post',
                data: {
                    name: this.form.username,
                    pwd: this.form.password
                }
            }).then(res => {
                console.log(res);
                const c = res.data.Code;
                const h = res.data.duration;
                if (c === 0) {
                    // 登录成功
                    localStorage.removeItem('TouristInfo');
                    localStorage.setItem('UserInfo', JSON.stringify(res.data.Data));
                    localStorage.setItem('Duration', h);
                    this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
                    this.$router.push({ name: 'Chat' });
                } else if (c === -1) {
                    // 账号或密码错误!
                    this.$message.error('账号或密码错误!');
                }
            }).catch(err => {
                this.$message.error('登录失败, 请检查网络连接是否正常。');
            });
        },
        touristsLogin () {
            const Prefix = '游客';
            const TimeStamp = Date.now();
            const TouristInfo = {
                premission: 0,
                name: Prefix + TimeStamp,
                avatar: "/static/images/tourist.png",
                sex: 'male',
                birthday: '2018-02-07',
                place: '',
                website: '',
                github: '',
                qq: '',
            }
            localStorage.removeItem('UserInfo');
            localStorage.setItem('TouristInfo', JSON.stringify(TouristInfo));
            this.$store.commit('UPDATE_TOURISTINFO', JSON.parse(localStorage.getItem('TouristInfo')));
            this.$router.push({ name: 'Chat' });
        },
        register() {
            this.$router.push({ name: 'Register' });
        }
    },
    mounted () {
        // 更新仓库用户信息状态
        this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
        this.$store.commit('UPDATE_TOURISTINFO', JSON.parse(localStorage.getItem('TouristInfo')));
        console.log(this.$socket.id)
    }
}
</script>

<template>
    <div class="window">
        <div class="background"></div>
        <div class="login">
            <div>
                <div>
                    <img class="avatar-image" src="/static/images/sleep.gif" style="width: 100px; height: 100px; min-width: 100px; min-height: 100px;">
                </div>
                <div>
                    <span style="position: relative; top: -4px;">{{ tip }}</span>
                    <div class="input normal">
                        <div>
                            <i class="icon"> </i>
                        </div>
                        <input v-model="form.username" id="name" type="text" placeholder="用户名">
                    </div>
                    <div class="input normal">
                        <div>
                            <i class="icon"> </i>
                        </div>
                        <input v-model="form.password" @keydown.enter="login" id="pwd" type="password" placeholder="密码">
                    </div>
                    <div>
                        <span @click="register">注册</span>
                        <button @click="login">登录</button>
                    </div>
                    <mu-flat-button 
                        @click="touristsLogin" 
                        label="游客登录" 
                        class="touristsLogin" 
                        secondary/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.touristsLogin {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 40px;
    line-height: 40px;
}
</style>
