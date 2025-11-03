// stores/folderStore.ts
import { defineStore } from "pinia";
import { useUser } from "./userStore";

export const useFolder = defineStore('folder', {
  state: () => ({
    folders: [] as any[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchFolders() {
      const userStore = useUser() // ✅ moved para dentro da action

      if (!userStore.token) {
        this.error = 'Token não encontrado'
        return
      }

      this.loading = true
      this.error = null

      try {
        this.folders = await $fetch('/api/folders', {
          headers: {
            authorization: `Bearer ${userStore.token}`,
          },
        })
      } catch (err: any) {
        this.error = err?.data?.statusMessage || 'Erro ao buscar pastas'
      } finally {
        this.loading = false
      }
    },

    async createFolder(name: string) {
      const userStore = useUser() // ✅ moved para dentro da action

      if (!userStore.token) {
        this.error = 'Token não encontrado'
        return
      }

      this.loading = true
      this.error = null

      try {
        const newFolder = await $fetch('/api/folders', {
          method: 'POST',
          headers: { authorization: `Bearer ${userStore.token}` },
          body: { name },
        })

        this.folders.push(newFolder)
      } catch (err: any) {
        this.error = err?.data?.statusMessage || 'Erro ao criar pasta'
      } finally {
        this.loading = false
      }
    },

    async updateFolderName(folderId: number, newName: string) {
      const userStore = useUser()
      if (!userStore.token) {
        this.error = 'Token não encontrado'
        return
      }

      try {
        const updated = await $fetch(`/api/folder/${folderId}/put`, {
          method: 'PUT',
          body: { name: newName },
          headers: { Authorization: `Bearer ${userStore.token}` }
        })

        const folder = this.folders.find(f => f.id === folderId)
        if (folder) folder.name = updated.name

        return updated
      } catch (err: any) {
        this.error = err?.data?.statusMessage || 'Erro ao renomear pasta'
      }
    },

    async deleteFolder(folderId: number) {
      const userStore = useUser()
      if (!userStore.token) {
        this.error = 'Token não encontrado'
        return
      }

      try {
        await $fetch(`/api/folder/${folderId}/delete`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userStore.token}` }
        })
        this.folders = this.folders.filter(f => f.id !== folderId)
      } catch (err: any) {
        this.error = err?.data?.statusMessage || 'Erro ao deletar pasta'
      }
    }
  },
})
