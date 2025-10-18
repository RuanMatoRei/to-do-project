// server/api/folders.get.ts
import auth from '../utils/auth'
import prisma from "../utils/prisma"
import { createError, defineEventHandler } from "h3"

export default defineEventHandler(async (ev) => {
    await auth(ev)

    const userId = ev.context.userId
    if(!userId) throw createError({ statusCode: 401, statusMessage: 'Id do usuário está inválido.' })

    try{
        const folders = await prisma.folder.findMany({ 
            where: { user_id: userId }, 
            include: { task: true }
        })

        return folders
    } catch(err){
        console.error("Erro ao buscar folders:", err)
        throw createError({ statusCode: 500, statusMessage: 'Erro interno ao buscar pastas' })
    }
})