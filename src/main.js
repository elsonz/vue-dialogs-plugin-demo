import Vue from 'vue'
import App from './App.vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

import dialogs from './plugins/dialogs';
Vue.use(dialogs, {hideOverlay: true});

new Vue({
    el: '#app',
    render: h => h(App)
})
