<!-- pages/folder/[id].vue -->
<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useFolder } from '~/stores/folderStore'
import { useTask } from '~/stores/taskStore'
import { useRoute, useRouter } from 'vue-router'

// Components
import Header from '~/layout/header.vue'
import TaskLayout from '~/layout/TaskLayout.vue'

// Stores
const folderStore = useFolder()
const taskStore = useTask()
const router = useRouter()
const route = useRoute()

// Pegar pasta atual
const folderId = Number(route.params.id)
const folder = folderStore.folders.find(f => f.id === folderId)
const newTask = ref('')

// Ref para o input de nova tarefa
const newTaskField = ref<any>(null)

// Modal de confirmação de deleção
const dialog = ref(false)

// Regras
const rules = {
  required: (v: string) => !!v || 'Não pode ser vazio',
  titleRules: (v: string) => (v.length >= 1 && v.length <= 32) || 'Título deve conter entre 1 e 32 caracteres'
}

// ---- Edição do título ----
const editing = ref(false)
const newName = ref(folder?.name || '')

// flag pra ignorar o primeiro clique (o que abre a edição)
let ignoreNextClick = false

function startEditing() {
  editing.value = true
  ignoreNextClick = true // ignora o clique que acabou de abrir
  nextTick(() => {
    const input = document.getElementById('folderNameInput') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

// Função para salvar o novo nome da pasta
async function saveName() {
  if (!folder) return
  const trimmed = newName.value.trim()

  if (!trimmed || trimmed === folder.name) {
    editing.value = false
    return
  }

  await folderStore.updateFolderName(folder.id, trimmed)
  folder.name = trimmed // atualiza localmente
  editing.value = false
}

// ---- Detectar clique fora ----
function handleClickOutside(e: MouseEvent) {
  // Ignora clique imediatamente após abrir edição
  if (ignoreNextClick) {
    ignoreNextClick = false
    return
  }

  // Para edição do nome da pasta
  if (editing.value) {
    const input = document.getElementById('folderNameInput')
    if (input && !input.contains(e.target as Node)) {
      saveName()
    }
  }

  // Para input de nova tarefa
  const taskInputEl = newTaskField.value?.$el?.querySelector('input')
  if (taskInputEl && !taskInputEl.contains(e.target as Node)) {
    newTaskField.value?.resetValidation()
  }
}

// Adicionar e remover listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ---- Criar tarefa ----
function createTask() {
  if (!newTask.value.trim()) return

  taskStore.creeateTask(folderId, newTask.value.trim())
  newTask.value = ''

  // Resetar validação e tirar foco
  nextTick(() => {
    newTaskField.value?.resetValidation()
    newTaskField.value?.blur()
  })
}

// ---- Deletar pasta ----
async function deleteFolder() {
  if (!folder) return
  await folderStore.deleteFolder(folderId)
  dialog.value = false
  router.push('/') // redireciona para a página inicial
}
</script>

<template>
  <Header :exit="false" />

  <v-container>
    <div class="d-flex align-center mb-3">
      <v-icon color="primary" class="me-2">mdi-folder</v-icon>

      <!-- modo leitura -->
      <span v-if="!editing" class="text-h5 font-weight-medium cursor-pointer" @click="startEditing">
        {{ folder?.name }}
      </span>

      <!-- modo edição -->
      <v-text-field
        v-else
        id="folderNameInput"
        v-model="newName"
        variant="plain"
        density="compact"
        single-line
        hide-details
        autofocus
        @keyup.enter.prevent="saveName"
        class="text-h5 font-weight-medium"
      />

      <v-btn icon color="red" variant="tonal" title="Deletar" @click="dialog = true" class="ms-auto">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <!-- Campo nova tarefa -->
    <div class="d-flex align-center ga-2 mb-4">
      <v-text-field
        ref="newTaskField"
        v-model="newTask"
        label="Nova Tarefa"
        variant="outlined"
        clearable
        hide-details
        density="comfortable"
        class="flex-grow-1"
        @keyup.enter.prevent="createTask"
        :rules="[rules.required, rules.titleRules]"
      />
      <v-btn color="primary" @click="createTask" :disabled="!newTask">
        Criar
      </v-btn>
    </div>

    <TaskLayout :folder="folder" :folder-id="folderId" />
  </v-container>

  <!-- Dialog de confirmação para deletar pasta -->
  <v-dialog v-model="dialog" width="400">
    <v-card>
      <v-card-title>Deletar Pasta</v-card-title>
      <v-card-text>Tem certeza que deseja deletar a pasta "{{ folder.name }}" e todas as suas tarefas?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancelar</v-btn>
        <v-btn color="red" text @click="deleteFolder">Deletar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
