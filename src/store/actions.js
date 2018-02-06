import * as types from './mutation-types';


/**
 * @function selectSource 选择播放源
 */
export const selectSource = ({ commit, state }, item) => {
    return new Promise((resolve, reject) => {
        commit('SET_PLAY_SOURCE', item);
        resolve();
    })
}
