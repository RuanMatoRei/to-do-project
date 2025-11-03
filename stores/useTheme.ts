import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    current: 'dark' as 'dark' | 'light',
  }),

  actions: {
    toggleTheme(theme: any) {
      if (!theme?.global?.name) return console.error('Theme undefined!')

      this.current = this.current === 'dark' ? 'light' : 'dark'
      theme.global.name.value = this.current
      localStorage.setItem('theme', this.current)
    },

    initTheme(theme: any) {
      if (!theme?.global?.name) return console.error('Theme undefined!')

      const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
      this.current = saved ?? 'dark'
      theme.global.name.value = this.current
    },
  },
})
