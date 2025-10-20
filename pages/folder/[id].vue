<script setup lang="ts">  
import { useFolder } from '~/stores/folderStore';
import { useRoute } from 'vue-router';
import { useTask } from '~/stores/taskStore';
import { ref, onMounted } from 'vue';


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
    <h1>{{ folder.name }}</h1>

    <v-text-field
            v-model="newTask"
            label="Nova Tarefa"
            variant="outlined"
            clearable
        />
        <v-btn
            color="blue"
            class="mt-4"
            @click="taskStore.creeateTask(folderId, newTask)"
        >
            Criar
        </v-btn>

    <ul>
        <li v-for="t in folder.task">{{ t.title }}</li>
    </ul>
</template>