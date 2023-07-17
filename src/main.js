import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import store from './store'

const app = createApp(App)

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
    defaults: {
        global: {
            ripple: false,
        }
    }
})

app.use(store)
app.use(router)
app.use(vuetify)
app.mount('#app')
