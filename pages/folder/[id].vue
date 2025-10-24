<script setup lang="ts">
import { useFolder } from '~/stores/folderStore'
import { useTask } from '~/stores/taskStore'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const folderStore = useFolder()
const taskStore = useTask()
const route = useRoute()
const folderId = Number(route.params.id)

const folder = folderStore.folders.find((f) => f.id === folderId)
const newTask = ref('')

onMounted(() => {
  console.log(folder)
})


</script>

<template>
  <h1 class="text-h5 mb-4">{{ folder.name }}</h1>

  <!-- Campo para criar nova tarefa -->
  <div class="d-flex align-center ga-2 mb-4">
    <v-text-field
      v-model="newTask"
      label="Nova Tarefa"
      variant="outlined"
      clearable
      hide-details
      density="comfortable"
      class="flex-grow-1"
    />
    <v-btn
      color="primary"
      @click="taskStore.creeateTask(folderId, newTask)"
      :disabled="!newTask"
    >
      Criar
    </v-btn>
  </div>

  <!-- Lista de tarefas -->
  <div v-for="t in folder.task" :key="t.id" class="d-flex align-center justify-space-between py-2 px-3 rounded bg-grey-lighten-4 mb-2">
    <div class="d-flex align-center ga-2">
      <!-- Checkbox -->
      <v-checkbox
        v-model="t.done"
        hide-details
        density="compact"
        @click="taskStore.updateDone(t.id, folderId)"
      />

      <!-- Título da tarefa -->
      <span :class="{ 'text-decoration-line-through': t.done }">
        {{ t.title }}
      </span>
    </div>

    <!-- Botão deletar -->
    <v-btn
      icon
      color="red"
      variant="tonal"
      @click="taskStore.deleteTask(t.id, folderId)"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

<style scoped>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>
