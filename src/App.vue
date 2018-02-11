<script>
export default {
	name: 'app',
	components: {
		
	},
	mounted () {
		
	}
}

</script>

<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<style lang="scss">
@import './assets/style/common/style.scss';
@import './assets/style/ui-modification.scss';
@import url('./assets/style/common/solarized-light.css');
.fade-enter-active,
.fade-leave-active {
	transition: all .3s ease;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

// 自定义样式重置
html,
body,
#app {
	width: 100%;
	height: 100%;
}
h1,h2,h3,h4,h5,h6 {
    margin: 0;
    padding: 0;
}
</style>