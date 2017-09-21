import TinyDropdopwn from './tiny-dropdown'

function install (Vue, _) {
  Vue.component('TinyDropdopwn', TinyDropdopwn)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default TinyDropdopwn
