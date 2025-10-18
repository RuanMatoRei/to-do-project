// middleware/auth.global.ts
import { useUser } from "~/stores/userStore";

export default defineNuxtRouteMiddleware((to) => {
    const userStore = useUser()

    if(process.client && !userStore.isLoggedIn()){
        userStore.load()
    } 

    // Imperdir acesso a tela de login/register se já estiver logado
    if(userStore.isLoggedIn() && ['/login', '/register'].includes(to.path)){
        return navigateTo('/')
    }

    const privateRoutes = ['/'] //Rotas que só pode ser acessada após o login

    if(!userStore.isLoggedIn() && privateRoutes.includes(to.path)){
        return navigateTo('/login')
    }

})