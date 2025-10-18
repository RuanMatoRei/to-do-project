<script setup lang="ts">
import { ref } from 'vue';
import { useUser } from '~/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUser()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  nameRules: (value: string) => (value.length >= 3 && value.length <= 12) || 'Nome deve conter entre 3 e 12 caracteres',
  validEmail: (value: string) => /\S+@\S+\.\S+/.test(value) || 'Email inválido',
  passwordRules: (value: string) => (value.length >= 8 && value.length <= 12) || 'A senha deve conter entre 8 e 12 caracteres'
}

const register = async() => {
    try{
        const res = await $fetch<{token: string, user: {id: number, name: string, email: string}}>('/api/auth/register', {
            method: 'post',
            body: { name: name.value, email: email.value, password: password.value }
        })

        userStore.save(res)
        router.push('/')
    } catch(err:any){
        error.value = err?.data?.message || err?.statusMessage
    }
}

</script>

<template>
    <v-container>
        <h1>Register</h1>

        <v-text-field
            label="Name"
            color="blue"
            variant="outlined"
            clearable
            :rules="[rules.required, rules.nameRules]"
            v-model="name"
        />
        <v-text-field
            label="Email"
            color="blue"
            variant="outlined"
            clearable
            :rules="[rules.required, rules.validEmail]"
            v-model="email"
        />
        <v-text-field
            label="Senha"
            color="blue"
            variant="outlined"
            clearable
            :rules="[rules.required, rules.passwordRules]"
            v-model="password"
        />

        <v-btn
            color="blue"
            class="mt-4"
            @click="register"
        >
            Registrar
        </v-btn>

        <span v-if="error">{{ error }}</span>
        <span>Já tem conta? <nuxtLink to="/login">Login</nuxtLink></span>
    </v-container>
    
</template>