<!-- /pages/index.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import Header from '~/layout/header.vue';
import FolderHome from '~/layout/FolderHome.vue'
import { useThemeStore } from '~/stores/useTheme'
import { useTheme } from 'vuetify';

const theme = useTheme()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme(theme)
})
</script>

<template>
  <div>
    <Header />
    <FolderHome />
  </div>
</template>
