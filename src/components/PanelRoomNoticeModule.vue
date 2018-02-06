<script>
export default {
    name: 'PanelRoomNoticeModule',
    data () {
        return {

        }
    }
}
</script>

<template>
    <div class="float-panel roomNoticePanel">
        <div>
            <span>群公告</span>
            <i @click="$emit('close')" class="icon close"></i>
        </div>
        <div class="group-notice">
            <div>
                system
                更新于
                2017年10月20日 17:43
            </div>
            <div class="content">欢迎各位来到 Emlice </div>
        </div>
    </div>
</template>