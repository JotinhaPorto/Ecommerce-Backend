import { S3, S3Client } from "@aws-sdk/client-s3"
import { ImageProduct, Prisma, PrismaClient } from "@prisma/client"
import { Billboard, Product } from "../types/Billboard"

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



export const getBillboardById = async (storeId: string, billboardId: string) => await prisma.billboard.findUnique({
    where: {
        id: billboardId, storeId,
    },
    include: {
        image: true
    }
})
export const getAllBillboards = async (storeId: string) => await prisma.billboard.findMany({ where: { storeId } })
export const createBillboard = async (data: Billboard) => await prisma.billboard.create({
    data: {
        storeId: data.storeId,
        label: data.label,
        image: {
            create: {
                url: data.image.url,
                name: data.image.name,
                key: data.image.key,
                size: data.image.size
            }
        }
    }
})

export const deleteBillboard = async (storeId: string, billboardId: string) => {
    const imageBillboard = await ImageByBillboardId(billboardId)

    await deleteS3Image(imageBillboard!.key)
    return await prisma.$transaction([
        prisma.imageBillboard.deleteMany({ where: { billboardId } }),
        prisma.billboard.delete({ where: { id: billboardId, storeId } })
    ])
}

export const updateBillboard = async (billboardId: string, data: Billboard) => {
    console.log("=====DATA DO PRISMA=====")
    console.log(data)
    return await prisma.billboard.update({
        where: {
            id: billboardId,
            storeId: data.storeId
        },
        data: {
            label: data.label,
            image: {
                update: {
                    where: {
                        billboardId
                    },
                    data: {
                        url: data.image.url,
                        name: data.image.name,
                        key: data.image.key,
                        size: data.image.size
                    }
                }
            }
        }
    })
}
export const deleteS3Image = async (key: string) => {

    const s3 = new S3({ region: process.env.AWS_DEFAULT_REGION });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    }

    return await s3.deleteObject(params)



}
export const ImageByBillboardId = async (billboardId: string) => await prisma.imageBillboard.findUnique({ where: { billboardId } })

type createCategoryData = Prisma.Args<typeof prisma.category, 'create'>['data']

export const createCategory = async (data: createCategoryData) => await prisma.category.create({ data })
export const getAllCategories = async (storeId: string) => await prisma.category.findMany({ where: { storeId }, include: { billboard: true } })
export const getCategoryById = async (storeId: string, categoryId: string) => await prisma.category.findUnique({ where: { storeId, id: categoryId } })
export const getCategoryByBillboardId = async (storeId: string, billboardId: string) => await prisma.category.findFirst({ where: { storeId, billboardId } })

export const updateCategory = async (storeId: string, categoryId: string, data: any) => await prisma.category.update({
    where: { id: categoryId, storeId },
    data: {
        name: data.name,
        billboardId: data.billboardId
    }
})

export const deleteCategory = async (storeId: string, categoryId: string) => await prisma.category.delete({ where: { id: categoryId, storeId } })

export const getAllProducts = async (storeId: string) => await prisma.product.findMany({
    where: { storeId }, include: {
        category: true,
        color: true,
        size: true
    }
})
export const getProductById = async (storeId: string, productId: string) => await prisma.product.findUnique({
    where: { storeId, id: productId },
    include: {
        category: true,
        color: true,
        size: true,
        image: true,
    }
})
export const getProductByCategoryId = async (storeId: string, categoryId: string) => await prisma.product.findFirst({ where: { storeId, categoryId } })
export const getProductByColorId = async (storeId: string, colorId: string) => await prisma.product.findFirst({ where: { storeId, colorId } })
export const getProductBySizeId = async (storeId: string, sizeId: string) => await prisma.product.findFirst({ where: { storeId, sizeId } })
export const createProduct = async (data: Product) => {
    return await prisma.product.create({

        data: {
            isAvailable: data.isAvailable,
            isFeatured: data.isFeatured,
            storeId: data.storeId,
            name: data.name,
            price: data.price,
            categoryId: data.categoryId,
            colorId: data.colorId,
            sizeId: data.sizeId,
            image: {
                createMany: {
                    data: data.image
                }
            },
        }
    })
}

export const updateProduct = async (productId: string, data: any) => {
    console.log("=====DATA DO PRISMA=====")
    console.log(data)
    await prisma.product.update({
        where: { id: productId },
        data: {
            isAvailable: data.isAvailable,
            isFeatured: data.isFeatured,
            name: data.name,
            price: data.price,
            categoryId: data.categoryId,
            colorId: data.colorId,
            sizeId: data.sizeId,
            image: {
                deleteMany: { productId },
                createMany: {
                    data: data.image
                }
            }
        }
    })
}




export const deleteProduct = async (storeId: string, productId: string) => {

    const imagesProduct = await ImagesByProductId(productId)
    const keysofImageProduct = imagesProduct.map((image) => image.key)

    await deleteS3Images(keysofImageProduct)
    return await prisma.$transaction([
        prisma.imageProduct.deleteMany({ where: { productId } }),
        prisma.product.delete({ where: { id: productId, storeId } })
    ])
}
export const deleteS3Images = async (keys: string[]) => {
    const s3 = new S3({ region: process.env.AWS_DEFAULT_REGION });



    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
            Objects: keys.map((key) => ({ Key: key })),
        }
    }

    return await s3.deleteObjects(params)


}

export const ImagesByProductId = async (productId: string) => await prisma.imageProduct.findMany({ where: { productId } })
