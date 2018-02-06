<script>
export default {
    name: 'ContactsModule',
    props: {
        lock: {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            open: false
        }
    },
    watch: {
        lock () {
            this.toggle();
        }  
    },
    methods: {
        toggle () {
            this.open = !this.open
        }
    }
}
</script>

<template>
    <div>
        <mu-drawer left :open="open" :docked="false" @close="toggle()">
            <mu-appbar title="Emlice Chat"/>
            <mu-list>
            <mu-list>
                <mu-sub-header>最近聊天记录</mu-sub-header>
                <mu-list-item title="Mike Li">
                <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="Maco Mai">
                <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="Alex Qin">
                <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="Allen Qun">
                <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="Myron Liu">
                <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
            </mu-list>
            <mu-divider/>
            <mu-list>
                <mu-sub-header>历史聊天记录</mu-sub-header>
                <mu-list-item title="Gaia Zhou">
                <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
                <mu-list-item title="Miller Wang">
                <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                <mu-icon value="chat_bubble" slot="right"/>
                </mu-list-item>
            </mu-list>
            <mu-list-item @click.native="open = false" title="Close"/>
            </mu-list>
        </mu-drawer>
    </div>
</template>

<style lang="scss" scoped>

</style>

