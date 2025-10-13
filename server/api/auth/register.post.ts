// server/api/auth/register.post.ts
import prisma from '~/server/utils/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createError, defineEventHandler, readBody } from 'h3'

const schema = z.object({
    name: z.string().min(3).max(16),
    email: z.string().email(),
    password: z.string().min(8).max(12)
})

export default defineEventHandler(async (ev) => {
    const body = await readBody(ev)

    const parsed = schema.safeParse(body)
    if(!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Dados inválidos!' })

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if(existing) throw createError({ statusCode: 400, statusMessage: 'Este email já existe' })   
        
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashed
        }
    })

    if(!process.env.JWT_KEY) throw createError({ statusCode: 500, statusMessage: 'JWT não configurado.' })

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: '7d' }
    )

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email }
    }

})




