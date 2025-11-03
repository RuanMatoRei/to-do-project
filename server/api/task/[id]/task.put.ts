// server/api/task/[id]/task.put.ts
import auth from '~/server/utils/auth'
import prisma from '~/server/utils/prisma'
import { createError, defineEventHandler } from 'h3'
import z from 'zod'

// Validação do título
const schema = z.object({
  title: z.string().min(3).max(35),
})

export default defineEventHandler(async (ev) => {
    await auth(ev)
    // Pega o ID do usuário autenticado
    const userId = ev.context.userId
    if (!userId) throw createError({ statusCode: 401, statusMessage: 'Usuário inválido' })

    // Pega o ID da task dos parâmetros
    const taskId = Number(ev.context.params?.id)
    if (!taskId) throw createError({ statusCode: 400, statusMessage: 'ID da task inválido' })

    const body = await readBody(ev)
    const parsed = schema.safeParse(body)
    if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Título inválido!' })

    const { title } = parsed.data

    // Confere se a task pertence ao usuário
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { folder: true }
    })
    if (!task || task.folder.user_id !== userId) {
        throw createError({ statusCode: 403, statusMessage: 'Sem permissão para editar essa task' })
    }

    // Atualiza o título
    const updated = await prisma.task.update({
        where: { id: taskId },
        data: { title }
    })

    return updated
})