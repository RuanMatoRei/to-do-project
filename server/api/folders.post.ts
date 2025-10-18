// server/api/folders.post.ts
import auth from '../utils/auth'
import prisma from "../utils/prisma"
import { createError, defineEventHandler } from "h3"
import z, { string } from 'zod'

const schema = z.object({
    name: z.string().min(3).max(20)
})

export default defineEventHandler(async (ev) => {
    await auth(ev)

    const userId = ev.context.userId
    if(!userId) throw createError({ statusCode: 401, statusMessage: 'Id do usuário é inválido'})

    const body = await readBody(ev)
    const parsed = schema.safeParse(body)
    if(!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Dados inválidos!' })

    const { name } = parsed.data

    const folder = await prisma.folder.create({
        data: {
            name: name,
            user_id: userId
        },
        include: { task: true }
    })

    return folder

})