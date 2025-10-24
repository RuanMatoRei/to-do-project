// server/api/task/[id].delete.ts
import auth from '~/server/utils/auth'
import prisma from "~/server/utils/prisma"
import { createError, defineEventHandler } from "h3"

export default defineEventHandler(async (ev) => {
    await auth(ev)

    const userId = ev.context.userId
    if(!userId) throw createError({ statusCode: 401, statusMessage: 'ID do usuário é inválido' })

    const taskId = Number(ev.context.params?.id)
    if(!taskId) throw createError({ statusCode: 400, statusMessage: 'Task inválida'})

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { folder: true }
    })

    if(!task) throw createError({ statusCode: 404, statusMessage: 'Task não encontrada' })
    if(task.folder.user_id !== userId) throw createError({ statusCode: 403, statusMessage: 'Sem permissão para deletar essa tarefa.' })
    
    await prisma.task.delete({ where: { id: taskId } })

    return { success: true, message: "Task deletada com sucesso" };
})