<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useFolder } from '~/stores/folderStore'
import { useUser } from '~/stores/userStore'
import { useRouter } from 'vue-router'
import TaskLayout from './TaskLayout.vue'

// Stores e router
const folderStore = useFolder()
const userStore = useUser()
const router = useRouter()

const newFolder = ref('')
const folderInput = ref<InstanceType<typeof import('vuetify/components')['VTextField']>>()

// Regras
const rules = {
    required: (v: string) => !!v || 'Não pode ser vazio',
    nameRules: (v: string) =>
        (v.length >= 3 && v.length <= 12) || 'Nome deve conter entre 3 e 12 caracteres',
}

// Fetch pastas
onMounted(() => {
    folderStore.fetchFolders()
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Criar nova pasta
async function createNewFolder() {
    if (!newFolder.value.trim()) return

    await folderStore.createFolder(newFolder.value.trim())
    newFolder.value = ''

    // 🔹 desfoca e reseta validação
    nextTick(() => {
        folderInput.value?.resetValidation()
        folderInput.value?.blur()
    })
}

// Resetar validação ao desfocar
function handleBlur() {
    folderInput.value?.resetValidation()
}

// 🔹 Resetar validação ao clicar fora
function handleClickOutside(e: MouseEvent) {
    const inputEl = folderInput.value?.$el?.querySelector('input')
    if (inputEl && !inputEl.contains(e.target as Node)) {
        folderInput.value?.resetValidation()
    }
}
</script>

<template>
    <!-- Campo de criação -->
    <v-card class="pa-4 d-flex align-center ga-2" variant="plain">
        <v-text-field
            ref="folderInput"
            v-model="newFolder"
            label="Nova Pasta"
            variant="outlined"
            hide-details="auto"
            clearable
            :rules="[rules.required, rules.nameRules]"
            class="flex-grow-1"
            @keyup.enter.prevent="createNewFolder"
            @blur="handleBlur"
        />
        <v-btn prepend-icon="mdi-folder-plus" color="primary" @click="createNewFolder">
            Criar
        </v-btn>
    </v-card>

    <!-- Grade responsiva -->
    <v-container fluid class="pa-4">
        <v-row dense>
            <v-col
                v-for="f in folderStore.folders"
                :key="f.id"
                cols="6"
                md="4"
                lg="3"
                :title="`Abrir pasta [${f.name}]`"
            >
                <v-card
                    variant="tonal"
                    class="pa-3 d-flex flex-column transition-fast folder-card"
                    hover
                    @click="router.push(`/folder/${f.id}`)"
                >
                    <div class="d-flex align-center mb-2">
                        <v-icon color="primary" class="me-2">mdi-folder</v-icon>
                        <v-card-title class="text-h6 pa-0 text-truncate">{{ f.name }}</v-card-title>
                    </div>

                    <TaskLayout
                        :folder="f"
                        :folder-id="f.id"
                        :trash="false"
                        :disable="true"
                        :editable="false"
                        class="flex-grow-1 overflow-hidden"
                    />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.folder-card {
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.2s;
    max-height: 300px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;
}
</style>
