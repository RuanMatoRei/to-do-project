// stores/taskStore.ts
import { defineStore } from "pinia";
import { useUser } from "./userStore";
import { useFolder } from "./folderStore";

interface Task {
    title: string,
    done: boolean,
    description: string, 
    folder_id: number
}

export const useTask = defineStore('task', {
    state: () => ({
        tasks: [] as Task[],
        erro: null as string | null,
    }),

    actions: {
        async creeateTask(folderId: number, title: string){
            const userStore = useUser()
            if (!userStore.token) {
                this.erro = 'Token não encontrado'
                return
            }

            this.erro = null

            try{   
                const task = await $fetch<Task>(`/api/folder/${folderId}/task`, {
                    method: 'post',
                    body: { title },
                    headers: { Authorization: `Bearer ${userStore.token}`}
                })

                // atualiza task store
                this.tasks.push(task)
                
                // Atualiza a store
                const folderStore = useFolder()
                const folder = folderStore.folders.find(f => f.id === folderId)
                if(folder){
                    folder.task = folder.task || []
                    folder.task.push(task)
                }

                return task
            } catch(err: any){
                console.log(this.erro = err?.data?.statusMessage || 'Erro ao criar tarefa')
            }
        }
    }
})