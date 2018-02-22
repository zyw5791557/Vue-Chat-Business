import vm from '@/main.js';

/**
 * @function 工具函数
 * touristTips              游客提示
 * noticeProcess            消息处理器
 */

export const touristTips = () => {
    vm.$notify.info({
        title: '消息',
        message: '游客没有该权限哦！'
    });
}


export const noticeProcess = (param,type) => {
    const baidu = vm.$store.state.expression.baidu.data;
    if (type === 'expression') {
        var baidu_idx;
        baidu.some((item, index) => {
            if (item === param) {
                baidu_idx = index;
            }
        });
        if (baidu_idx === undefined) return param;
        return `[表情]`;
    } else if (type === 'printscreen') {
        return `[图片]`;
    } else if(type === 'code') {
        return `[代码片段]`;
    } else {
        var FTA = param.match(/^(https?|ftp|file):\/\//g);
        var f = param.match(/.*(\.png|\.jpg|\.jpeg|\.gif)$/);
        if(FTA !== null && f !== null) return `[远程地址图片]`;
        if(FTA !== null) return `[链接]`; 
        return param;
    }
}