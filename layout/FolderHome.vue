<!-- layout/FolderHome.vue -->
<script setup lang="ts">
import { useFolder } from '~/stores/folderStore';
import { useUser } from '~/stores/userStore';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const folderStore = useFolder()
const userStore = useUser()
const newFolder = ref('')
const router = useRouter()

onMounted(() => {
    folderStore.fetchFolders()
})
</script>

<template>
    <div>
        <v-text-field
            v-model="newFolder"
            label="Nova pasta"
            variant="outlined"
            clearable
        />
        <v-btn
            color="blue"
            class="mt-4"
            @click="folderStore.createFolder(newFolder)"
        >
            Criar
        </v-btn>
        
        <ul v-for="f in folderStore.folders">
            <span style="font-weight: bold;" @click="router.push(`/folder/${f.id}`)">{{ f.name }}</span>
            <!-- <li v-for="t in f.task">{{ t.title }}</li> -->
        </ul>
    </div>

</template>