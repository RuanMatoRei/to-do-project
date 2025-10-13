// server/utils/auth.ts
import { createError, defineEventHandler } from "h3";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (ev) => {
    const authHeader = ev.node.req.headers['authorization']

    if(!authHeader) throw createError({ statusCode: 401, statusMessage: 'Token inválido' })

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.replace('Bearer ', '').trim()
        : authHeader.trim()
    
    try{
        if(!process.env.JWT_KEY){
            throw createError({ statusCode: 500, statusMessage: 'JWT_KEY não configurado' })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY) as { id: number }
        ev.context.userId = decoded.id
    } catch (err) {
        console.error("Erro ao verificar token:", err)
        throw createError({ statusCode: 401, statusMessage: 'Token inválido' })
    }

})