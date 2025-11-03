// server/api/folder/[id]/delete.ts
import auth from '~/server/utils/auth'
import prisma from "~/server/utils/prisma"
import { createError, defineEventHandler } from "h3"

export default defineEventHandler(async (ev) => {
    await auth(ev)

    const userId = ev.context.userId
    if(!userId) throw createError({ statusCode: 401, statusMessage: 'ID do usuário é inválido' })

    const folderId = Number(ev.context.params?.id)
    if(!folderId) throw createError({ statusCode: 400, statusMessage: 'Pasta inválida'})

    const folder = await prisma.folder.findUnique({
        where: { id: folderId }
    })

    if(!folder) throw createError({ statusCode: 404, statusMessage: 'Pasta não encontrada' })
    if(folder.user_id !== userId) throw createError({ statusCode: 403, statusMessage: 'Sem permissão para deletar essa pasta.' })
    
    await prisma.folder.delete({ where: { id: folderId } })

    return { success: true, message: "Pasta deletada com sucesso" };
})