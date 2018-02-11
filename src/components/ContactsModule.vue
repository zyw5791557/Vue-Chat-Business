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
            open: false,
            bottomNav: 'contacts',
            searchVal: 'Emlice'
        }
    },
    watch: {
        lock () {
            this.toggle();
        }  
    },
    computed: {
        contactsListState() {
            return this.bottomNav === 'contacts' ? true : false;
        }
    },
    methods: {
        toggle () {
            this.open = !this.open
        },
        handleChange (val) {
            this.bottomNav = val;
        }
    }
}
</script>

<template>
    <div>
        <mu-drawer left :open="open" :docked="false" @close="toggle()">
            <mu-appbar title="Contacts List"/>
            <mu-paper>
                <mu-bottom-nav :value="bottomNav" shift @change="handleChange">
                <mu-bottom-nav-item value="contacts" title="Contacts" icon="books"/>
                <mu-bottom-nav-item value="search" title="Search" icon="search"/>
                </mu-bottom-nav>
            </mu-paper>
            <mu-list v-if="contactsListState">
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
                <mu-list-item @click.native="open = false" title="Close"/>
            </mu-list>
            <mu-list v-else>
                <mu-text-field v-model="searchVal" hintText="搜索联系人" type="text" icon="search"/>
                <mu-list>
                    <mu-sub-header>查询结果</mu-sub-header>
                    <mu-list-item title="Mike Li">
                    <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                    <mu-icon value="add" slot="right"/>
                    </mu-list-item>
                    <mu-list-item title="Maco Mai">
                    <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                    <mu-icon value="add" slot="right"/>
                    </mu-list-item>
                    <mu-list-item title="Alex Qin">
                    <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                    <mu-icon value="add" slot="right"/>
                    </mu-list-item>
                    <mu-list-item title="Allen Qun">
                    <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                    <mu-icon value="add" slot="right"/>
                    </mu-list-item>
                    <mu-list-item title="Myron Liu">
                    <mu-avatar src="/static/images/user.jpg" slot="leftAvatar"/>
                    <mu-icon value="add" slot="right"/>
                    </mu-list-item>
                </mu-list>
            </mu-list>
        </mu-drawer>
    </div>
</template>

<style lang="scss" scoped>

</style>

