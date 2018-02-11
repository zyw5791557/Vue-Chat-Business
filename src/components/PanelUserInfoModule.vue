<script>
export default {
    name: 'PanelUserInfoModule',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    filters: {
        sexFilter (val) {
            return val === 'male' ? '男' : '女';
        },
        birthdayFilter (val) {
            return (new Date().getFullYear() - new Date(val).getFullYear()) <= 0 ? 1 : (new Date().getFullYear() - new Date(val).getFullYear());
        },
        placeFilter (val) {
            return val === '' ? '火星' : val;
        }
    },
    computed: {
        loadData () {
            return this.data;
        }
    },
    methods: {
        loadChat () {
            const o = {
                name: this.loadData.Data.name,
                userID: this.loadData.Data.name,
                avatar: this.loadData.Data.avatar,
                unread: 0,
                messageInfo: {}
            }
            this.$emit('chat', o);
            this.$emit('close');
        }
    },
    mounted () {
        console.log(this.loadData)
    }
}
</script>

<template>
    <div class="user-info" v-if="loadData.Data">
        <div>
            <i @click="$emit('close')" class="icon"></i>
            <div class="background-image" :style="`background-image: url(${loadData.Data.avatar});`"></div>
            <div class="background-mask"></div>
            <div class="content"><img class="avatar-image" :src="loadData.Data.avatar"
                    style="width: 80px; height: 80px; min-width: 80px; min-height: 80px;"><span>{{ loadData.Data.name }}</span>
                <div class="icon-list">
                    <a class="icon" title="github" v-if="loadData.Data.github" :href="`//${loadData.Data.github}`" rel="noopener noreferrer" target="_blank"></a>
                    <a class="icon" title="website" v-if="loadData.Data.website" :href="`//${loadData.Data.website}`" rel="noopener noreferrer" target="_blank" style="position: relative; top: 3px;"></a>
                    <a class="icon" title="qq" v-if="loadData.Data.qq" :href="`tencent://message/?uin=${loadData.Data.qq}`" rel="noopener noreferrer" target="_blank"></a>
                </div>
            </div>
        </div>
        <div class="normal-status">
            <div>
                <div>
                    <div>
                        <span>性别:</span>
                        <span>年龄:</span>
                        <span>时长:</span>
                        <span>位置:</span>
                    </div>
                    <div>
                        <span>{{ loadData.Data.sex | sexFilter }}</span>
                        <span>{{ loadData.Data.birthday | birthdayFilter }}</span>
                        <span>{{ loadData.duration }}天</span>
                        <span>{{ loadData.Data.place | placeFilter }}</span>
                    </div>
                </div>
            </div>
            <div>
                <button @click="loadChat">发起聊天</button>
            </div>
        </div>
    </div>
</template>
