// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light', // inicial fixo
      themes: {
        light: {
          dark: false,
          colors: {
            background: '#f5f5f5',
            surface: '#FFFFFF',
            primary: '#1976D2',
            secondary: '#424242',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          },
        },
        dark: {
          dark: true,
          colors: {
            background: '#121212',
            surface: '#1E1E1E',
            primary: '#90CAF9',
            secondary: '#B0BEC5',
            error: '#e43838ff',
            info: '#81D4FA',
            success: '#A5D6A7',
            warning: '#FFE082',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
