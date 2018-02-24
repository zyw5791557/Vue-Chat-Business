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
            searchVal: '',
        }
    },
    watch: {
        lock () {
            this.toggle();
        }  
    },
    computed: {
        contactsListState () {
            return this.bottomNav === 'contacts' ? true : false;
        },
        myContactsList () {
            return this.$store.state.myContactsList;
        },
        searchUserRes () {
            return this.$store.state.searchUserRes;
        }
    },
    methods: {
        toggle () {
            this.open = !this.open
        },
        handleChange (val) {
            this.bottomNav = val;
        },
        searchUser () {
            this.$store.commit('SOCKET_SEARCH_USER_EMIT', this.searchVal);
        },
        addContacts (item) {
            this.$store.commit('SOCKET_ADD_CONTACTS_EMIT', item);
        },
        loadChat (item) {
            const o = {
                name: item.name,
                userID: item.name,
                avatar: item.avatar,
                unread: 0,
                messageInfo: {}
            }
            this.$emit('loadChatPanel', o);
            this.toggle();
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
                    <mu-sub-header>我的联系人</mu-sub-header>
                    <mu-list-item @click="loadChat(item)" v-for="(item, index) in myContactsList" :key="index" :title="item.name">
                    <mu-avatar :src="item.avatar" slot="leftAvatar"/>
                    <mu-icon value="chat_bubble" slot="right"/>
                    </mu-list-item>
                </mu-list>
            </mu-list>
            <mu-list v-else>
                <div class="search-box">
                    <mu-text-field 
                    v-model="searchVal"
                    hintText="搜索联系人" 
                    type="text" 
                    icon="search"
                    class="search-val"/>
                    <mu-raised-button @click="searchUser" label="查找" fullWidth/>
                </div>
                <mu-list>
                    <mu-sub-header>查询结果</mu-sub-header>
                    <mu-list-item v-for="(item, index) in searchUserRes" :key="index" :title="item.name">
                    <mu-avatar :src="item.avatar" slot="leftAvatar"/>
                    <mu-icon @click="addContacts(item)" value="add" slot="right"/>
                    </mu-list-item>
                </mu-list>
            </mu-list>
            <mu-divider/>
            <mu-list-item @click.native="open = false" title="Close"/>
        </mu-drawer>
    </div>
</template>

<style lang="scss" scoped>
.search-box {
    .search-val {
        margin-bottom: 0;
    }
}
.mu-list {
    min-height: 600px;
}
</style>

