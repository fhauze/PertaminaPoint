import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import { createPinia } from 'pinia'
import Vue3Lottie from 'vue3-lottie'
import store from '@/stores'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css"

const pinia = createPinia()
createApp(App)
    .use(pinia)
    .use(router)
    .use(Vue3Lottie)
    .use(store)
    .use(Toast)
    .mount('#app')

