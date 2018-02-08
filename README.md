# **Vue-Chat-Business**

[![Build Status](https://travis-ci.org/yinxin630/fiora.svg?branch=master)](https://travis-ci.org/yinxin630/fiora)
[![author](https://img.shields.io/badge/author-Emlice-blue.svg)](http://suisuijiang.com)
[![Node.js Version](https://img.shields.io/badge/node.js-8.2.1-blue.svg)](http://nodejs.org/download)

语言: [简体中文](REMEAD.md)

> 该版本可能商用, 推荐使用[Vue-Chat](https://github.com/zyw5791557/Vue-Chat)  
> [Vue-Chat](https://github.com/zyw5791557/Vue-Chat)为个人项目, 将会不定期抽空维护和ADD IDEA。  
> 功能基本一致, 个别功能会做增删。  

该项目是[EmliceChat](https://github.com/zyw5791557/Vue-Chat-Business)的重构项目。不再使用 jquery,采用效果更好的Vue全家桶编写，同时也方便后期维护和新IDEA的添加。


## 重要更新
### v1.0.0 | 2018-02-07
1.新增游客登录模块  
2.优化模板  
3.测试，修改常见BUG  

### v1.0.1 | 2018-02-08
1.尝试重构模板  
2.解决重构模板产生的蒙版紊乱问题  
3.优化整体逻辑布局

## 功能

#### 未完成
1. 消息撤回
2. 私聊 typing 状态
3. 当地天气状态
4. 新建群聊 && 加入群聊
5. 歌曲循环(单曲循环/顺序播放/随机播放)


#### 已完成

1. 创建用户, 私聊, 群聊
2. 文本, 图片, 代码, url,截图,跨域图片等多种类型消息
3. 桌面通知, 声音提醒, 通知开关
4. 头像修改, 群组公告修改,用户信息修改
5. 简易的插件系统
6. 内置音乐播放器
7. 消息类型自动解析
8. 剪切板复制图片
9. 反防盗链技术
10. 游客登录

## 安装

该项目依赖于node.js(>= 8.2.1)和mongodb数据库. 安装[node.js](https://npm.taobao.org/mirrors/node). 安装[mongodb](https://docs.mongodb.com/manual/installation/).

0. 克隆项目到本地
      `git clone git@https://github.com/zyw5791557/Vue-Chat-Business`
1. 进行项目目录执行
  `yarn` 或者 `npm install
2. 运行项目服务端
  `npm run dev` 
3. 打开 `http://localhost:8065` 查看效果

## 运行截图

![](screenshot_01.png)

## 备注

1. 该项目前期 UI 来自碎碎酱的https://github.com/yinxin630/fiora 
2. 逻辑代码全部自我完成。



# To start

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli)

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build

```

# Folder structure
* build - webpack config files
* config - webpack config files
* dist - build
* server - socket.io service,api and db. files
* src -your app
    * api
    * assets
    * common
    * components - your vue components
    * mock
    * styles
    * views - your pages
    * vuex
    * App.vue
    * main.js - main file
    * routes.js
* static - static assets

# Browser support
- 强烈推荐 Chrome, Opera, Firefox.
Modern browsers and IE 9+.
