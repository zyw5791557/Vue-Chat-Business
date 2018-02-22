
const socket = {
    // namespaced: true,
    state: {},
    getters: {},
    mutations: {

        SOCKET_USER_JOIN_EMIT (state, name) {
            this._vm.$socket.emit('user join', name);
        },

        SOCKET_MESSAGE_READ_EMIT (state, obj) {
            this._vm.$socket.emit('message read', obj);
        },

        SOCKET_CHECK_PERMISSION_EMIT (state, name) {
            this._vm.$socket.emit('check permission', name);
        },
        
        SOCKET_MESSAGE_EMIT (state, msg) {
            this._vm.$socket.emit('message', msg);
        },

        SOCKET_TAKE_MESSAGES_EMIT (state, o) {
            this._vm.$socket.emit('take messages', o);
        },

        SOCKET_TAKEUSERINFO_EMIT (state, name) {
            this._vm.$socket.emit('take userInfo', name);
        },

        SOCKET_OFFLINE_NOREAD_MESSAGES_EMIT (state, name) {
            this._vm.$socket.emit('Offline noRead messages', name);
        },
        
        SOCKET_TYPING_EMIT (state, obj) {
            this._vm.$socket.emit('typing', obj);
        },
        
        SOCKET_STOPTYPING_EMIT (state, obj) {
            this._vm.$socket.emit('stop typing', obj);
        },

        SOCKET_LOGOUT_EMIT (state, name) {
            this._vm.$socket.emit('logout', name);
        },
        
        SOCKET_ADD_CONTACTS_EMIT (state, item) {
            this._vm.$socket.emit('add contacts', item);
        },

        SOCKET_SEARCH_USER_EMIT (state, name) {
            this._vm.$socket.emit('search user', name);
        },

        SOCKET_CONNECT (state) {
            this._vm.$socket.connect();
        },

        SOCKET_DISCONNECT (state) {
            this._vm.$socket.disconnect();
        },

    },
    actions: {}
}

export default socket;