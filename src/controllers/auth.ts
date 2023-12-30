import { RequestHandler } from "express"
import z from 'zod'
import * as Auth from '../services/auth'
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const Register: RequestHandler = async (req, res) => {

    const registerSchema = z.object({
        name: z.string().max(20, "Nome muito grande"),
        email: z.string().email(),
        password: z.string()
    })

    const data = registerSchema.safeParse(req.body)

    if (!data.success) {
        return res.json({ error: data.error.message })
    }

    const hashedPassword = await bcrypt.hash(data.data.password, 10)

    const newUser = await Auth.createUser({
        name: data.data.name,
        email: data.data.email,
        hashedPassword: hashedPassword
    })

    if (!newUser) {
        return res.json({ error: "Erro ao criar usuário" })
    }

    const { hashedPassword: _, ...user } = newUser

    const token = await Auth.createToken(newUser.id)
    res.json({ User: user, success: "Usuário criado com sucesso", token })

}
export const Login: RequestHandler = async (req, res) => {

    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const data = loginSchema.safeParse(req.body)

    if (!data.success) {
        return res.json({ error: "Dados inválidos" })
    }

    const user = await Auth.getUserByEmail(data.data.email)

    if (!user) {
        return res.json({ error: "Usuário inexistente" })
    }

    const passwordCompare = bcrypt.compare(data.data.password, user?.hashedPassword)

    if (!passwordCompare) {
        return res.json({ error: "Senha inválida" })
    }

    const { hashedPassword: _, ...userLogin } = user

    const token = await Auth.createToken(user.id)

    res.json({ userLogin, token })
}