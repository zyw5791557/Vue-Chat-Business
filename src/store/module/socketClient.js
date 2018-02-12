
const socket = {
    // namespaced: true,
    state: {},
    getters: {},
    mutations: {
        SOCKET_CHECK_PERMISSION_EMIT (state, name) {
            this._vm.$socket.emit('check permission', name);
        },

        SOCKET_TAKEUSERINFO_EMIT (state, name) {
            this._vm.$socket.emit('take userInfo', name);
        },

        SOCKET_LOGOUT_EMIT (state, name) {
            this._vm.$socket.emit('logout', name);
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