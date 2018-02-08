<script>
/**@data
 * tip              注册小提示
 * form             表单状态
 * 
 * @methods
 * usernameCheck    用户名检查
 * login            跳转登录页
 * register         注册事件
 */
export default {
    name: 'Register',
    data () {
        return {
            tip: '滴滴,新司机打卡~',
            form: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        usernameCheck () {
            if(this.form.username.slice(0,2) === '游客') {
                this.$notify({
                    title: '警告',
                    message: '不要冒充游客啦~',
                    type: 'warning'
                });
                this.form.username = '';
            }
        },
        login () {
            this.$router.push({ name: 'Login' })
        },
        register () {
            if(!this.form.username) {
                this.$message.error('请输入账号!');
                return;
            }
            if(!this.form.password) {
                this.$message.error('请输入密码!');
                return;
            }
            this.getApi('register',{
                method: 'post',
                data: {
                    name: this.form.username,
                    pwd: this.form.password,
                    avatar: this.$STATIC_URL + "/images/users/default.png",
                    sex: 'male',
                    birthday: '2017-12-25',
                    place: '',
                    website: '',
                    github: '',
                    qq: ''
                }
            }).then(res => {
                const c = res.data.Code;
                if (c === 0) {
                    // 注册成功
                    var userData = {
                    	name: this.form.username,
                    	avatar: this.$STATIC_URL + "/images/users/default.png",
                    	sex: 'male',
                    	birthday: '2017-12-25',
                    	place: '',
                    	website: '',
                    	github: '',
                    	qq: '',
                    }
                    this.$message({
                        message: '注册成功, 即将自动跳转。',
                        type: 'success'
                    });
                    setTimeout(() => {
                        localStorage.setItem('UserInfo', JSON.stringify(userData));
                        localStorage.setItem('Duration', 1);
                        this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
                        this.$router.push({ name: 'Chat' });
                    }, 1000);
                } else if (c === 1) {
                    // 账号已存在, 请重新输入一个账号
                    this.$message.error('账号已存在, 请重新输入一个账号。');  
                }
            }).catch(err => {
                this.$message.error('注册失败, 请检查网络连接是否正常。');
            });
        }
    }
}
</script>

<template>
    <div class="window">
        <div class="background"></div>
        <div class="login">
            <div>
                <div>
                    <img class="avatar-image" src="/static/images/user.jpg" style="width: 100px; height: 100px; min-width: 100px; min-height: 100px;">
                </div>
                <div>
                    <span style="position: relative; top: -4px;">{{ tip }}</span>
                    <div class="input normal">
                        <div>
                            <i class="icon"> </i>
                        </div>
                        <input v-model="form.username" @blur="usernameCheck" id="name" type="text" placeholder="用户名">
                    </div>
                    <div class="input normal">
                        <div>
                            <i class="icon"> </i>
                        </div>
                        <input v-model="form.password" @keydown.enter="register" id="pwd" type="password" placeholder="密码">
                    </div>
                    <div>
                        <span @click="login">登录</span>
                        <button @click="register">注册</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>
