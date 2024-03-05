"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesByProductId = exports.deleteS3Images = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySizeId = exports.getProductByColorId = exports.getProductByCategoryId = exports.getProductById = exports.getAllProducts = exports.deleteCategory = exports.updateCategory = exports.getCategoryByBillboardId = exports.getCategoryById = exports.getAllCategories = exports.createCategory = exports.ImageByBillboardId = exports.deleteS3Image = exports.updateBillboard = exports.deleteBillboard = exports.createBillboard = exports.getAllBillboards = exports.getBillboardById = exports.deleteSize = exports.updateSize = exports.getSizeById = exports.getAllSizes = exports.createSize = exports.deleteColor = exports.updateColor = exports.createColor = exports.getColorById = exports.getAllColors = exports.deleteStore = exports.createStore = exports.editStore = exports.getAllStores = exports.getStoreByStoreId = exports.getFirstStoreByUserId = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getFirstStoreByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.store.findFirst({ where: { userId: id } }); });
exports.getFirstStoreByUserId = getFirstStoreByUserId;
const getStoreByStoreId = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.store.findFirst({ where: { id } }); });
exports.getStoreByStoreId = getStoreByStoreId;
const getAllStores = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.store.findMany({ where: { userId: id } }); });
exports.getAllStores = getAllStores;
const editStore = (id, name) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.store.update({ where: { id }, data: { name } }); });
exports.editStore = editStore;
const createStore = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.store.create({ data }); });
exports.createStore = createStore;
const deleteStore = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.store.delete({ where: { id } }); });
exports.deleteStore = deleteStore;
const getAllColors = (storeId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.color.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } }); });
exports.getAllColors = getAllColors;
const getColorById = (storeId, colorId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.color.findUnique({ where: { id: colorId, storeId } }); });
exports.getColorById = getColorById;
const createColor = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.color.create({ data }); });
exports.createColor = createColor;
const updateColor = (storeId, colorId, data) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.color.update({ where: { id: colorId, storeId }, data }); });
exports.updateColor = updateColor;
const deleteColor = (storeId, colorId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.color.delete({ where: { id: colorId, storeId } }); });
exports.deleteColor = deleteColor;
const createSize = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.size.create({ data }); });
exports.createSize = createSize;
const getAllSizes = (storeId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.size.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } }); });
exports.getAllSizes = getAllSizes;
const getSizeById = (storeId, sizeId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.size.findUnique({ where: { id: sizeId, storeId } }); });
exports.getSizeById = getSizeById;
const updateSize = (storeId, sizeId, data) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.size.update({ where: { id: sizeId, storeId }, data }); });
exports.updateSize = updateSize;
const deleteSize = (storeId, sizeId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.size.delete({ where: { id: sizeId, storeId } }); });
exports.deleteSize = deleteSize;
const getBillboardById = (storeId, billboardId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.billboard.findUnique({
        where: {
            id: billboardId, storeId,
        },
        include: {
            image: true
        }
    });
});
exports.getBillboardById = getBillboardById;
const getAllBillboards = (storeId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.billboard.findMany({ where: { storeId } }); });
exports.getAllBillboards = getAllBillboards;
const createBillboard = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.billboard.create({
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
    });
});
exports.createBillboard = createBillboard;
const deleteBillboard = (storeId, billboardId) => __awaiter(void 0, void 0, void 0, function* () {
    const imageBillboard = yield (0, exports.ImageByBillboardId)(billboardId);
    yield (0, exports.deleteS3Image)(imageBillboard.key);
    return yield prisma.$transaction([
        prisma.imageBillboard.deleteMany({ where: { billboardId } }),
        prisma.billboard.delete({ where: { id: billboardId, storeId } })
    ]);
});
exports.deleteBillboard = deleteBillboard;
const updateBillboard = (billboardId, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=====DATA DO PRISMA=====");
    console.log(data);
    return yield prisma.billboard.update({
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
    });
});
exports.updateBillboard = updateBillboard;
const deleteS3Image = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const s3 = new client_s3_1.S3({ region: process.env.AWS_DEFAULT_REGION });
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };
    return yield s3.deleteObject(params);
});
exports.deleteS3Image = deleteS3Image;
const ImageByBillboardId = (billboardId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.imageBillboard.findUnique({ where: { billboardId } }); });
exports.ImageByBillboardId = ImageByBillboardId;
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.category.create({ data }); });
exports.createCategory = createCategory;
const getAllCategories = (storeId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.category.findMany({ where: { storeId }, include: { billboard: true } }); });
exports.getAllCategories = getAllCategories;
const getCategoryById = (storeId, categoryId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.category.findUnique({ where: { storeId, id: categoryId } }); });
exports.getCategoryById = getCategoryById;
const getCategoryByBillboardId = (storeId, billboardId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.category.findFirst({ where: { storeId, billboardId } }); });
exports.getCategoryByBillboardId = getCategoryByBillboardId;
const updateCategory = (storeId, categoryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.category.update({
        where: { id: categoryId, storeId },
        data: {
            name: data.name,
            billboardId: data.billboardId
        }
    });
});
exports.updateCategory = updateCategory;
const deleteCategory = (storeId, categoryId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.category.delete({ where: { id: categoryId, storeId } }); });
exports.deleteCategory = deleteCategory;
const getAllProducts = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findMany({
        where: { storeId }, include: {
            category: true,
            color: true,
            size: true
        }
    });
});
exports.getAllProducts = getAllProducts;
const getProductById = (storeId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findUnique({
        where: { storeId, id: productId },
        include: {
            category: true,
            color: true,
            size: true,
            image: true,
        }
    });
});
exports.getProductById = getProductById;
const getProductByCategoryId = (storeId, categoryId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.product.findFirst({ where: { storeId, categoryId } }); });
exports.getProductByCategoryId = getProductByCategoryId;
const getProductByColorId = (storeId, colorId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.product.findFirst({ where: { storeId, colorId } }); });
exports.getProductByColorId = getProductByColorId;
const getProductBySizeId = (storeId, sizeId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.product.findFirst({ where: { storeId, sizeId } }); });
exports.getProductBySizeId = getProductBySizeId;
const createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.create({
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
    });
});
exports.createProduct = createProduct;
const updateProduct = (productId, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=====DATA DO PRISMA=====");
    console.log(data);
    yield prisma.product.update({
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
    });
});
exports.updateProduct = updateProduct;
const deleteProduct = (storeId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const imagesProduct = yield (0, exports.ImagesByProductId)(productId);
    const keysofImageProduct = imagesProduct.map((image) => image.key);
    yield (0, exports.deleteS3Images)(keysofImageProduct);
    return yield prisma.$transaction([
        prisma.imageProduct.deleteMany({ where: { productId } }),
        prisma.product.delete({ where: { id: productId, storeId } })
    ]);
});
exports.deleteProduct = deleteProduct;
const deleteS3Images = (keys) => __awaiter(void 0, void 0, void 0, function* () {
    const s3 = new client_s3_1.S3({ region: process.env.AWS_DEFAULT_REGION });
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
            Objects: keys.map((key) => ({ Key: key })),
        }
    };
    return yield s3.deleteObjects(params);
});
exports.deleteS3Images = deleteS3Images;
const ImagesByProductId = (productId) => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.imageProduct.findMany({ where: { productId } }); });
exports.ImagesByProductId = ImagesByProductId;
