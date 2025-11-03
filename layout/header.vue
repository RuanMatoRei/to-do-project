<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useThemeStore } from '~/stores/useTheme'
import { useUser } from '~/stores/userStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  logo: {
    type: Boolean,
    default: true
  }, 
  toogleTheme: {
    type: Boolean,
    default: true
  }, 
  exit: {
    type: Boolean,
    default: true
  }
})

const userStore = useUser()
const themeStore = useThemeStore()
const router = useRouter()

const $vuetifyTheme = useTheme() // ✅ Agora o header tem acesso ao tema

// Sair do site
function logout() {
  userStore.logout()
  router.push('/login')
} 
</script>

<template>
  <v-container
    class="d-flex flex-row justify-space-between pa-4"
    fluid
  >
    <!-- Página -->
    <h1
      class="cursor-pointer ma-0"
      v-if="props.logo"
      @click="router.push('/')"
    >
      Home
    </h1>

    <!-- Mudar tema e sair do app -->
    <div class="d-flex align-center ga-4">
      <v-btn
        icon
        variant="plain"
        @click="themeStore.toggleTheme($vuetifyTheme)" 
        :title="`Ativar tema ${themeStore.current === 'light' ? 'escuro' : 'claro'}`"
      >
        <v-icon>
          {{ themeStore.current === 'light' ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
        </v-icon>
      </v-btn>

      <v-icon v-if="exit" color="error" title="Sair" class="me-2 cursor-pointer" @click="logout">mdi-exit-to-app</v-icon>
        
    </div>
  </v-container>
</template>
