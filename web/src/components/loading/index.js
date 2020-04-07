import loadingComponent from './loading.vue';

const loading = {
    install:function(Vue) {
        Vue.component('Loading', loadingComponent)
    }
}

export default loading;