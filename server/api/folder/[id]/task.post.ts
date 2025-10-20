// server/api/folder/[id]/task.post.ts
import auth from '~/server/utils/auth'
import prisma from "~/server/utils/prisma"
import { createError, defineEventHandler } from "h3"
import z from 'zod'

const schema = z.object({ 
    title: z.string().min(3).max(35)
})
export default defineEventHandler(async (ev) => {
    await auth(ev)

    const userId = ev.context.userId 
    if(!userId) throw createError({ statusCode: 401, statusMessage: 'Id do usuário é inválido' })

    const folderId = Number(ev.context.params?.id)
    if(!folderId) throw createError({ statusCode: 400, statusMessage: 'Id da pasta é inválido' })

    // Verifica se a pasta existe
    const folder = await prisma.folder.findUnique({
        where: { id: folderId }
    })

    if (!folder || folder.user_id !== userId) {
        throw createError({ statusCode: 403, statusMessage: "Sem permissão para adicionar tarefa nesta pasta" });
    }

    const body = await readBody(ev)
    const parsed = schema.safeParse(body)
    if(!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Dados inválidos!' })   

    const { title } = parsed.data

    const task = await prisma.task.create({
        data: {
            title: title,
            folder_id: folderId,
            done: false,
            description: ''
        }
    })

    return task
})