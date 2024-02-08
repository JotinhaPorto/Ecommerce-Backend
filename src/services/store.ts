import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getFirstStoreByUserId = async (id: string) => await prisma.store.findFirst({ where: { userId: id } })
export const getStoreByStoreId = async (id: string) => await prisma.store.findFirst({ where: { id } })
export const getAllStores = async (id: string) => await prisma.store.findMany({ where: { userId: id } })
export const editStore = async (id: string, name: string) => await prisma.store.update({ where: { id }, data: { name } })

type createStoreData = Prisma.Args<typeof prisma.store, 'create'>['data']

export const createStore = async (data: createStoreData) => await prisma.store.create({ data })

export const deleteStore = async (id: string) => await prisma.store.delete({ where: { id } })

type createColorData = Prisma.Args<typeof prisma.color, 'create'>['data']
type updateColorData = Prisma.Args<typeof prisma.color, 'update'>['data']

export const getAllColors = async (storeId: string) => await prisma.color.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } })
export const getColorById = async (storeId: string, colorId: string) => await prisma.color.findUnique({ where: { id: colorId, storeId } })
export const createColor = async (data: createColorData) => await prisma.color.create({ data })
export const updateColor = async (storeId: string, colorId: string, data: updateColorData) => await prisma.color.update({ where: { id: colorId, storeId }, data })
export const deleteColor = async (storeId: string, colorId: string) => await prisma.color.delete({ where: { id: colorId, storeId } })


type createSizeData = Prisma.Args<typeof prisma.size, 'create'>['data']
type updateSizeData = Prisma.Args<typeof prisma.size, 'update'>['data']

export const createSize = async (data: createSizeData) => await prisma.size.create({ data })
export const getAllSizes = async (storeId: string) => await prisma.size.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } })
export const getSizeById = async (storeId: string, sizeId: string) => await prisma.size.findUnique({ where: { id: sizeId, storeId } })
export const updateSize = async (storeId: string, sizeId: string, data: updateSizeData) => await prisma.size.update({ where: { id: sizeId, storeId }, data })
export const deleteSize = async (storeId: string, sizeId: string) => await prisma.size.delete({ where: { id: sizeId, storeId } })