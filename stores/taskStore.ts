// stores/taskStore.ts
import { defineStore } from "pinia";
import { useUser } from "./userStore";
import { useFolder } from "./folderStore";

// Definição da interface Task
interface Task {
    title: string,
    done: boolean,
    description: string, 
    folder_id: number,
    id: number
}

// Definição da store de tarefas
export const useTask = defineStore('task', {
    state: () => ({
        tasks: [] as Task[],
        erro: null as string | null,
    }),

    actions: {
        // Criação de uma nova tarefa
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
        },

        // Atualização do status "done" da tarefa
        async updateDone(taskId: number, folderId: number) {
            const token = useUser().token
            if (!token) return (this.erro = 'Token não encontrado')

            const folder = useFolder().folders.find(f => f.id === folderId)
            const task = folder?.task?.find((t: any) => t.id === taskId)
            if (!task) return

            try {
                const updated = await $fetch<Task>(`/api/task/${taskId}/done`, {
                    method: 'PUT',
                    body: { done: !task.done },
                    headers: { Authorization: `Bearer ${token}` }
                })

                task.done = updated.done
                const t = this.tasks.find(t => t.id === taskId)
                if (t) t.done = updated.done
            } catch (err: any) {
                this.erro = err?.data?.statusMessage || 'Erro ao atualizar tarefa'
            }   
        },

        // Atualização do título da tarefa
        async updateTaskTitle(taskId: number, folderId: number, title: string) {
            const userStore = useUser()
            if (!userStore.token) {
                this.erro = 'Token não encontrado'
                return
            }

            this.erro = null

            try {
                const updated = await $fetch<Task>(`/api/task/${taskId}/task`, {
                    method: 'put',
                    body: { title },
                    headers: { Authorization: `Bearer ${userStore.token}` }
                })

                // Atualiza localmente na pasta
                const folderStore = useFolder()
                const folder = folderStore.folders.find(f => f.id === folderId)
                const task = folder?.task?.find((t: any) => t.id === taskId)
                if (task) task.title = updated.title

                // Atualiza também na lista global
                const t = this.tasks.find(t => t.id === taskId)
                if (t) t.title = updated.title

                return updated
            } catch (err: any) {
                console.log(this.erro = err?.data?.statusMessage || 'Erro ao atualizar tarefa')
            }
        },

        // Deleção de uma tarefa
        async deleteTask(taskId: number, folderId: number){
            const userStore = useUser()
            if (!userStore.token) {
                this.erro = 'Token não encontrado'
                return
            }

            this.erro = null

            try{
                await $fetch<Task>(`/api/task/${taskId}`, {
                    method: 'delete',
                    headers: { Authorization: `Bearer ${userStore.token}`}
                })

                // Remove localmente
                const folderStore = useFolder()
                const folder = folderStore.folders.find(f => f.id === folderId)
                if(folder && folder.task){
                    folder.task = folder.task.filter((t: any) => t.id !== taskId)
                }

                // Remove do array global de tasks
                this.tasks = this.tasks.filter((t: any) => t.id !== taskId)
            } catch(err: any){
                console.log(this.erro = err?.data?.statusMessage || 'Erro ao deletar tarefa')
            }
        }
    }
})