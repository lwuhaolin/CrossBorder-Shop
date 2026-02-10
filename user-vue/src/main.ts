import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import i18n from './i18n'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use Vue Router for routing
app.use(router)

// Use i18next for internationalization
app.use(i18n)

// Use Ant Design Vue for UI components
app.use(Antd)

app.mount('#app')
