<script>
export default {
    name: 'PanelRoomInfoModule',
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    data () {
        return {

        }
    },
    computed: {
        loadData () {
            return this.data;
        }
    }
}
</script>

<template>
    <div class="float-panel roomInfoPanel">
        <div>
            <span>群设置</span>
            <i @click="$emit('close')" class="icon close"></i></div>
        <div class="group-info">
            <div class="content">
                <span>管理员：</span>
                <span>无</span></div>
            <div class="content">
                <span>在线人数：</span>
                <span class="onlineUsers">{{ loadData.length }} 人</span>
            </div>
            <div class="userList">
                <div v-for="(item, index) in loadData" :key="index" @click="$emit('startChat', item.name),$emit('close');" :data-user="item.name">
                    <img class="avatar-image" :src="item.avatar" style="width: 40px; height: 40px; min-width: 40px; min-height: 40px;">
                    <span class="text-ellipsis">{{ item.name }}</span>
                </div>
            </div>
            <input type="file" accept="image/*"></div>
        <div class="group-info-exit">
            <button>退出群组</button></div>
    </div>
</template>
