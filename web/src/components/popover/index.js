import popoverComponent from './popover.vue';

const popover = {
    install:function(Vue) {
        Vue.component('Popover', popoverComponent)
    }
}

export default popover;