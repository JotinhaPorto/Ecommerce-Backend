import { Prisma, PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

type createUserData = Prisma.Args<typeof prisma.user, 'create'>['data']
export const createUser = async (data: createUserData) => {
    try {
        const existEmail = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (existEmail) {
            return false
        }

        return await prisma.user.create({ data })
    }
    catch (error: any) {
        return false
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        return await prisma.user.findUnique({ where: { email } })
    }
    catch (error: any) {
        return false
    }
}
export const getUserById = async (id: string) => {
    try {
        return await prisma.user.findUnique({ where: { id } })
    }
    catch (error: any) {
        return false
    }
}

export const createToken = async (userId: string) => jwt.sign(userId, process.env.JWT_SECRET as string)
