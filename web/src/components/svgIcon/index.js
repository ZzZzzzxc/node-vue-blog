import Vue from 'vue'
import SvgIcon from './index.vue' // svg组件

// 注册到全局
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../../assets/svg/', false, /\.svg$/)
requireAll(req)
