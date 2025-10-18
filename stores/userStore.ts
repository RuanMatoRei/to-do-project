// stores/userStore.ts
import { defineStore } from "pinia";
import { ref } from "vue"; 

interface User {
    id: number
    name: string,
    email: string
}

interface LoginResponse {
    token: string,
    user: User
}

export const useUser = defineStore('user', () => {
    const user = ref<User | null>(null)
    const token = ref<string| null>(null)

    const save = (data: LoginResponse) => {
        user.value = data.user
        token.value = data.token

        if(process.client){
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.token)
        }
    }

    const load = () => {
        if(process.client) {
            const u = localStorage.getItem('user')
            const t = localStorage.getItem('token')
        
            if(u && t) {
                user.value = JSON.parse(u) as User
                token.value = t
            }
        }
    }

    const logout = () => {
        user.value = null
        token.value = null

        if(process.client){
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }

    const isLoggedIn = () => !!token.value

    return {
        user,
        token,
        save,
        load,
        logout,
        isLoggedIn
    }
    
})