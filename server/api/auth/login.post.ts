// server/api/auth/login.post.ts
import prisma from '~/server/utils/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createError, defineEventHandler, readBody } from 'h3'

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(12)
})

export default defineEventHandler(async (ev) => {
    const body = await readBody(ev)
    console.log('Body recebido:', body)

    const parsed = schema.safeParse(body)
    if(!parsed.success){
        throw createError({ statusCode: 400, statusMessage: 'Dados inválidos.' })
    }

    const { email, password } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })
    if(!user) throw createError({ statusCode: 400, statusMessage: 'E-mail inválido!' })

    const match = await bcrypt.compare(password, user.password)
    if(!match) throw createError({ statusCode: 400, statusMessage: 'Senha incorreta' }) 

    if(!process.env.JWT_KEY) throw createError({ statusCode: 500, statusMessage: 'JWT não configurado' })

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: '7d' }
    )

    return {
        token, 
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }

})


