import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';


const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
app.use(PrimeVue, {
    unstyled: true
});