<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '~/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUser()

const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
    error.value = ''
    try{
        const res = await $fetch<{token: string, user: {id: number, name: string, email: string}}>('/api/auth/login', {
            method: 'post',
            body: { email: email.value, password: password.value }
        })

        userStore.save(res)
        router.push('/')
    } catch(err: any){
        error.value = err?.data?.message || err?.statusMessage || 'Erro ao logar'
    }
}

</script>

<template>
    <div class="login-page">
    <div class="login-form">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" placeholder="Email" type="email" required />
        <input v-model="password" placeholder="Senha" type="password" required />
        <button type="submit">Entrar</button>
      </form>
      <p v-if="error">{{ error }}</p>

      <span>Ainda não tem conta? <nuxtLink to="/register">Registre-se</nuxtLink></span>
    </div>
  </div>
</template>