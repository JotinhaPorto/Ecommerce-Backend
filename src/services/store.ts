import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getStoreByUserId = async (id: string) => await prisma.store.findFirst({ where: { userId: id } })
export const getStoreByStoreId = async (id: string) => await prisma.store.findFirst({ where: { id } })
export const getAllStores = async (id: string) => await prisma.store.findMany({ where: { userId: id } })
export const editStore = async (id: string, name: string) => await prisma.store.update({ where: { id }, data: { name } })

type createStoreData = Prisma.Args<typeof prisma.store, 'create'>['data']

export const createStore = async (data: createStoreData) => await prisma.store.create({ data })

export const deleteStore = async (id: string) => await prisma.store.delete({ where: { id } })