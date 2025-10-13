<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tasks = ref<any[]>([])  // array vazio por padrão

async function fetchUsers() {
  try {
    const data = await $fetch('/api/task')  // chama seu endpoint
    console.log('🚀 Dados recebidos:', data)
    tasks.value = data
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <h1>Testando</h1>
    <ul>
      <li v-for="u in tasks" :key="u.id">{{ u.title }}</li>
    </ul>
  </div>
</template>
