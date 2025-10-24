// server/api/task/[id]/done.put.ts
import auth from '~/server/utils/auth'
import prisma from "~/server/utils/prisma"
import { createError, defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (ev) => {
    await auth(ev)

    const userId = ev.context.userId
    if(!userId) throw createError({ statusCode: 401, statusMessage: 'ID de usuário inválido' })

    const taskId = Number(ev.context.params?.id)
    const body = await readBody<{done: boolean}>(ev)

    if(typeof body.done !== "boolean") { throw createError({ statusCode: 400, statusMessage: "Valor inválido para 'done'" }); }

    const updateTask = await prisma.task.update({
        where: { id: taskId },
        data: { done: body.done }
    })

    return updateTask

})
