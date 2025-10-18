<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUser } from '~/stores/userStore'
import { useRouter } from 'vue-router'
import FolderHome from '~/layout/FolderHome.vue'

const userStore= useUser()
const router = useRouter()

function logout() {
  userStore.logout()
  router.push('/login')
} 

</script>

<template>
  <div>
    <h1>Home</h1>
    <button @click="logout">Sair</button>

    <folder-home/>

  </div>
</template>
