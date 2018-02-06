<script>
export default {
    name: 'PanelExpressionModule',
    data () {
        return {
            baidu_address: this.$STATIC_URL + '/images/expressions/baidu.png'
        }
    },
    computed: {

    }
}
</script>

<template>
    <div class="expression">
        <div class="default-expression">
            <div v-for="(item,index) in $store.state.expression.baidu.data" :key="index">
                <div :style="`background-position: left -${index * 30}px;background-image: url(${baidu_address});`" @click="$emit('send', $store.state.expression.baidu.data[index],'expression'),$emit('close')"></div>
            </div>
        </div>
        <div class="select-panel">
            <div class="selected">
                <img src="https://assets.suisuijiang.com/images/default-expression.f7d7c.png">
            </div>
            <div @click="$emit('unfinished')" class="">
                <img src="data:image/png;base64,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">
            </div>
            <div @click="$emit('unfinished')" class="">
                <img src="https://assets.suisuijiang.com/images/collect-expression.05769.png">
            </div>
        </div>
    </div>
</template>
