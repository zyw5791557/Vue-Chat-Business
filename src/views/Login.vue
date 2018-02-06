<script>
export default {
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
                    localStorage.setItem('UserInfo', JSON.stringify(res.data.Data));
                    localStorage.setItem('Duration', h);
                    this.$store.commit('UPDATE_USERINFO', JSON.parse(localStorage.getItem('UserInfo')));
                    this.$router.push({ name: 'Chatroom' });
                } else if (c === -1) {
                    // 账号或密码错误!
                    this.$message.error('账号或密码错误!');
                }
            }).catch(err => {
                this.$message.error('登录失败, 请检查网络连接是否正常。');
            });
        },
        register() {
            this.$router.push({ name: 'Register' });
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
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>
