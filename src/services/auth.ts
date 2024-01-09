import { Prisma, PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

type createUserData = Prisma.Args<typeof prisma.user, 'create'>['data']

export const createUser = async (data: createUserData) => await prisma.user.create({ data })

export const getUserByEmail = async (email: string) => await prisma.user.findFirst({ where: { email } })

export const getUserById = async (id: string) => await prisma.user.findFirst({ where: { id } })

export const createToken = async (userId: string) => jwt.sign(userId, process.env.JWT_SECRET as string)

export const verifyToken = async (token: string) => jwt.verify(token, process.env.JWT_SECRET as string)
