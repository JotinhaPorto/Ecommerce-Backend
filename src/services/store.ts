import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getStore = async (id: string) => await prisma.store.findFirst({ where: { id } })