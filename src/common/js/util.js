// 工具函数
export const touristTips = ($this) => {
    $this.$notify.info({
        title: '消息',
        message: '游客没有该权限哦！'
      });
}