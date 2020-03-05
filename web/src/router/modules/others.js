import Err from '../../views/others/Error.vue'
export default function(router) {
  router.push({
    path: '/error',
    name: 'error',
    component: Err
  })
}