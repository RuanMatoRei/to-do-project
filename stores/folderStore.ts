// stores/folderStore.ts
import { defineStore } from "pinia";
import { useUser } from "./userStore";

const userStore = useUser()

export const useFolder = defineStore('folder', {
    state: () => ({
        folders: [] as any[],
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchFolders() {
            if(!userStore.token) this.error = 'Token não encontrado'

            this.loading = true
            this.error = null

            try {
                this.folders = await $fetch('/api/folders', {
                    headers: {
                        authorization: `Bearer ${userStore.token}`
                    }
                })

            } catch(err: any){
                this.error = err?.data?.statusMessage || 'Erro ao buscar pastas'
            } finally {
                this.loading = false
            }
        },

        async createFolder(name: string) {
            if(!userStore.token) this.error = 'Token não encontrado'

            this.loading = true
            this.error = null
            
            try {
                const newFolder = await $fetch('/api/folders', {
                    method: 'post',
                    headers: { authorization: `Bearer ${userStore.token}` },
                    body: { name }
                })

                this.folders.push(newFolder)
            }catch(err: any){
                this.error = err?.data?.statusMessage || 'Erro ao criar pasta'        
            } finally{
                this.loading = false
            }
        }
    }
})