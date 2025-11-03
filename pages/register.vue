<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '~/stores/userStore';
import { useRouter } from 'vue-router';
import { useThemeStore } from '~/stores/useTheme';
import { useTheme } from 'vuetify';

import Header from '~/layout/header.vue';

// Theme initialization
const theme = useTheme()
const themeStore = useThemeStore()

onMounted(() => {
    themeStore.initTheme(theme)
})

// Stores and router
const router = useRouter()
const userStore = useUser()

// Form data
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

// Regras de validação
const rules = {
    required: (value: string) => !!value || 'Campo obrigatório',
    nameRules: (value: string) => (value.length >= 3 && value.length <= 12) || 'Nome deve conter entre 3 e 12 caracteres',
    validEmail: (value: string) => /\S+@\S+\.\S+/.test(value) || 'Email inválido',
    passwordRules: (value: string) => (value.length >= 8 && value.length <= 12) || 'A senha deve conter entre 8 e 12 caracteres'
}

// Funcção de registro
const register = async () => {
    try {
        const res = await $fetch<{ token: string, user: { id: number, name: string, email: string } }>('/api/auth/register', {
            method: 'post',
            body: { name: name.value, email: email.value, password: password.value }
        })

        userStore.save(res)
        router.push('/')
    } catch (err: any) {
        error.value = err?.data?.message || err?.statusMessage
    }
}

</script>

<template>
    <Header :logo="false" :toogleTheme="true" :exit="false" />

    <v-container class="fill-height d-flex align-center justify-center">
        <v-card color="background" class="pa-3" style="max-width: 420px; width: 100%; border-radius: 10px;">
            <v-card-title>
                <h1>Register</h1>
            </v-card-title>

            <v-card-text>
                <v-text-field label="Name" color="blue" variant="outlined" clearable
                    :rules="[rules.required, rules.nameRules]" v-model="name" />
                <v-text-field label="Email" color="blue" variant="outlined" clearable
                    :rules="[rules.required, rules.validEmail]" v-model="email" />
                <v-text-field label="Senha" color="blue" variant="outlined" clearable
                    :rules="[rules.required, rules.passwordRules]" v-model="password" />

                <span v-if="error" style="color: red; margin-top: 10px;">{{ error }}</span>
            </v-card-text>

            <v-card-actions class="d-flex flex-column justify-center" style="gap: 16px;">
                <v-btn color="primary" variant="tonal" class="mt-4" @click="register" @keydown.enter="register">
                    Registrar
                </v-btn>
            </v-card-actions>

            <span class="align-self-start text-body-2">
                Já tem conta?
                <nuxt-link class="text-primary font-medium" to="/login">Login</nuxt-link>
            </span>
        </v-card>
    </v-container>

</template>