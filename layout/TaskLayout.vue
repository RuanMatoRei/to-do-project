<script setup lang="ts">
import { useTask } from '~/stores/taskStore'

interface Task {
  id: number
  title: string
  done: boolean
}

interface Folder {
  id: number
  name: string
  task: Task[]
}

const props = withDefaults(defineProps<{
  folder: Folder
  folderId: number
  trash?: boolean
  disable?: boolean
  editable?: boolean
}>(), {
  trash: true,
  disable: false,
  editable: true
})

// Stores
const taskStore = useTask()
// Modal de edição
const dialog = ref(false)
const editedTitle = ref('')
const currentTask = ref<Task | null>(null)

// Modal de deleção
const deleteModal = ref(false)

// Regras de validação
const rules = {
  required: (v: string) => !!v || 'Não pode ser vazio',
  titleRules: (v: string) => (v.length >= 1 && v.length <= 32) || 'Título entre 1 e 32 caracteres'
}

// Função para abrir modal de edição
function openEditModal(task: Task) {
  currentTask.value = task
  editedTitle.value = task.title
  dialog.value = true
}

// Função para salvar edição
async function saveEdit() {
  if (!currentTask.value) return
  await taskStore.updateTaskTitle(currentTask.value.id, props.folderId, editedTitle.value)
  dialog.value = false
}

// Função para abrir modal de deleção
function openDeleteModal(task: Task) {
  currentTask.value = task
  deleteModal.value = true
}

// Função para deletar tarefa
async function deleteTask() {
  if (!currentTask.value) return
  await taskStore.deleteTask(currentTask.value.id, props.folderId)
  deleteModal.value = false
}
</script>

<template>
  <div
    v-for="t in props.folder.task"
    :key="t.id"
    class="task-row d-flex justify-space-between align-center py-2 px-3 rounded mb-2 bg-surface"
  >
    <!-- Esquerda -->
    <div class="d-flex align-center flex-grow-1 ga-2">
      <!-- Checkbox -->
      <div class="checkbox-wrapper">
        <v-checkbox
          v-model="t.done"
          hide-details
          density="compact"
          color="success"
          :disabled="props.disable"
          @click="taskStore.updateDone(t.id, folderId)"
        />
      </div>

      <!-- Título -->
      <div class="title-wrapper">
        <span
          class="task-title"
          :class="{ 'text-decoration-line-through': t.done }"
        >
          {{ t.title }}
        </span>
      </div>
    </div>

    <!-- Botões -->
    <div class="d-flex ga-1">
      <v-btn
        v-if="props.editable"
        icon
        variant="tonal"
        color="blue"
        title="Editar"
        @click="openEditModal(t)"
        class="task-btn"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        v-if="props.trash"
        icon
        color="red"
        variant="tonal"
        title="Deletar"
        class="task-btn"
        @click="openDeleteModal(t)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>

  <!-- Modal edit-->
  <v-dialog v-model="dialog" width="400">
    <v-card>
      <v-card-title>Editar tarefa</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="editedTitle"
          label="Título"
          variant="outlined"
          hide-details="auto"
          clearable
          :rules="[rules.required, rules.titleRules]"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="saveEdit">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete modal -->
   <v-dialog v-model="deleteModal" width="400">
    <v-card>
      <v-card-title>Deletar Pasta</v-card-title>
      <v-card-text>Tem certeza que deseja deletar a tarefa "{{ currentTask?.title }}"?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="deleteModal = false">Cancelar</v-btn>
        <v-btn color="red" text @click="deleteTask">Deletar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.task-row {
  align-items: flex-start; /* 👈 evita que o texto empurre a checkbox */
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px; /* 👈 reserva espaço fixo pra checkbox */
  margin-top: 2px;
}

.title-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 36px; /* 👈 garante alinhamento vertical */
}

.task-title {
  white-space: normal;
  word-break: break-word;
  line-height: 1.3;
}

.text-decoration-line-through {
  text-decoration: line-through;
}
</style>
