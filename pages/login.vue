<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUser } from '~/stores/userStore';
import { useRouter } from 'vue-router';
import { useThemeStore } from '~/stores/useTheme';
import { useTheme } from 'vuetify';
import Header from '~/layout/header.vue';

// Theme initialization
const theme = useTheme();
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme(theme);
});

// Stores and router
const router = useRouter();
const userStore = useUser();

// Form data
const email = ref('');
const password = ref('');
const showPassword = ref(false); // 👈 controla a visibilidade da senha
const generalError = ref('');

// Field errors
const emailError = ref<string[]>([]);
const passwordError = ref<string[]>([]);

// Regras de validação
const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
};

// Função de login
const login = async () => {
  generalError.value = '';
  emailError.value = [];
  passwordError.value = [];

  if (password.value.length < 8 || password.value.length > 32) {
    passwordError.value = ['Senha incorreta'];
    return;
  }

  try {
    const res = await $fetch<{ token: string; user: { id: number; name: string; email: string } }>(
      '/api/auth/login',
      {
        method: 'post',
        body: { email: email.value, password: password.value },
      }
    );

    userStore.save(res);
    router.push('/');
  } catch (err: any) {
    const data = err?.data || {};
    const status = err?.status;

    if (data?.errors) {
      if (data.errors.email)
        emailError.value = Array.isArray(data.errors.email)
          ? data.errors.email
          : [data.errors.email];

      if (data.errors.password)
        passwordError.value = Array.isArray(data.errors.password)
          ? data.errors.password
          : [data.errors.password];
    } else if (status === 401) {
      passwordError.value = [data?.message || 'Senha incorreta'];
    } else if (status === 404) {
      emailError.value = [data?.message || 'Email não encontrado'];
    } else {
      generalError.value = data?.message || err?.statusMessage || 'Erro ao logar';
    }
  }
};
</script>

<template>
  <Header :logo="false" :toogleTheme="true" :exit="false" />

  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-3" style="max-width:420px; width:100%; border-radius: 10px;">
      <v-card-title>
        <h1>Login</h1>
      </v-card-title>

      <v-card-text>
        <v-text-field
          label="Email"
          color="blue"
          variant="outlined"
          clearable
          :rules="[rules.required]"
          v-model="email"
          :error-messages="emailError"
        />

        <!-- Campo de senha com alternância -->
        <v-text-field
          label="Senha"
          color="blue"
          variant="outlined"
          clearable
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          :rules="[rules.required]"
          v-model="password"
          :error-messages="passwordError"
        />

        <span v-if="generalError" style="color: red; margin-top: 10px;">{{ generalError }}</span>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="d-flex flex-column align-center" style="gap: 16px;">
        <v-btn color="primary" variant="tonal" @click="login" @keydown.enter="login">
          Entrar
        </v-btn>

        <span class="align-self-start text-body-2">
          Não tem conta?
          <NuxtLink class="text-primary font-weight-medium" to="/register">
            Registre-se
          </NuxtLink>
        </span>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
