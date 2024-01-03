import { RequestHandler } from "express"
import z from 'zod'
import * as Auth from '../services/auth'
import bcrypt from 'bcrypt'
import { ApiErrorValidationFields } from "../utils/ApiError";


export const Register: RequestHandler = async (req, res) => {

    const registerSchema = z.object({
        name: z.string().max(20, "Nome muito grande"),
        email: z.string().email(),
        password: z.string()
    })

    const data = registerSchema.safeParse(req.body)

    if (!data.success) {
        throw new ApiErrorValidationFields("Dados inválidos", 200)
    }
    const { email, name, password } = data.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const exist = await Auth.getUserByEmail(email)

    if (exist) {
        throw new ApiErrorValidationFields('Esse e-mail já existe', 400, 'email')
    }

    const newUser = await Auth.createUser({
        email,
        name,
        hashedPassword
    })
    const { hashedPassword: _, ...user } = newUser

    const token = await Auth.createToken(newUser.id)

    return res.json({ User: user, success: "Usuário criado com sucesso", token })

}
export const Login: RequestHandler = async (req, res) => {

    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const data = loginSchema.safeParse(req.body)

    if (!data.success) {
        throw new ApiErrorValidationFields("Dados inválidos", 200)
    }

    const user = await Auth.getUserByEmail(data.data.email)

    if (!user) {
        throw new ApiErrorValidationFields("Usuário inexistente", 400, "email")
    }

    const passwordCompare = await bcrypt.compare(data.data.password, user?.hashedPassword)

    if (!passwordCompare) {
        throw new ApiErrorValidationFields("Senha inválida", 400, "password")
    }

    const { hashedPassword: _, ...userLogin } = user

    const token = await Auth.createToken(user.id)

    res.json({ userLogin, token })
}