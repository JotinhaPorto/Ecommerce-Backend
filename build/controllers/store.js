"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.uploadImages = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = exports.uploadImage = exports.deleteBillboard = exports.getAllBillboards = exports.getBillboardById = exports.updateBillboard = exports.createBillboard = exports.deleteSize = exports.updateSize = exports.getSizeById = exports.getAllSizes = exports.createSize = exports.deleteColor = exports.updateColor = exports.getColorById = exports.getAllColors = exports.createColor = exports.editStore = exports.deleteStore = exports.createStore = exports.getAllStores = exports.getStoreByStoreId = exports.getFirstStoreByUserId = void 0;
const Store = __importStar(require("../services/store"));
const Auth = __importStar(require("../services/auth"));
const ApiError_1 = require("../utils/ApiError");
const zod_1 = require("zod");
const getFirstStoreByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield Store.getFirstStoreByUserId(req.user);
    res.json(store);
});
exports.getFirstStoreByUserId = getFirstStoreByUserId;
const getStoreByStoreId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const store = yield Store.getStoreByStoreId(id);
    res.json(store);
});
exports.getStoreByStoreId = getStoreByStoreId;
const getAllStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield Store.getAllStores(req.user);
    res.json(stores);
});
exports.getAllStores = getAllStores;
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createStoreSchema = zod_1.z.object({
        name: zod_1.z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
    });
    const data = createStoreSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const user = yield Auth.getUserById(req.user);
    if (!user) {
        throw new ApiError_1.ApiErrorValidationFields("Não autorizado", 400);
    }
    const store = yield Store.createStore({
        name: data.data.name,
        userId: user.id,
    });
    if (!store) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao criar store", 400);
    }
    res.json(store);
});
exports.createStore = createStore;
const deleteStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleteStore = yield Store.deleteStore(id);
    if (!deleteStore) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao deletar loja", 400);
    }
    res.json(deleteStore);
});
exports.deleteStore = deleteStore;
const editStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const editStoreSchema = zod_1.z.object({
        name: zod_1.z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
    });
    const data = editStoreSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const editStore = yield Store.editStore(id, data.data.name);
    if (!editStore) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao editar loja", 400);
    }
    res.json(editStore);
});
exports.editStore = editStore;
const createColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const createColorStoreSchema = zod_1.z.object({
        name: zod_1.z
            .string()
            .min(4, "Nome deve ter mais que 4 caracteres")
            .max(10, "Nome deve ter menos que 10 caracteres"),
        value: zod_1.z.string().min(4).max(9).regex(/^#/, {
            message: "A string deve ser um valor de uma cor do tipo hex válida",
        }),
    });
    const data = createColorStoreSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const storeByStoreId = yield Store.getStoreByStoreId(storeId);
    if (!storeByStoreId) {
        throw new ApiError_1.ApiErrorValidationFields("Loja inexistente", 400);
    }
    const createColor = yield Store.createColor({
        name: data.data.name,
        value: data.data.value,
        storeId: storeByStoreId.id,
    });
    if (!createColor) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao criar cor", 400);
    }
    res.json(createColor);
});
exports.createColor = createColor;
const getAllColors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const colors = yield Store.getAllColors(storeId);
    if (!colors) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao buscar cores", 400);
    }
    res.json(colors);
});
exports.getAllColors = getAllColors;
const getColorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, colorId } = req.params;
    const color = yield Store.getColorById(storeId, colorId);
    res.json(color);
});
exports.getColorById = getColorById;
const updateColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, colorId } = req.params;
    const updateColorSchema = zod_1.z.object({
        name: zod_1.z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
        value: zod_1.z.string().min(4).max(9).regex(/^#/, {
            message: "A string deve ser um valor de uma cor do tipo hex válida",
        }),
    });
    const data = updateColorSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const updateColor = yield Store.updateColor(storeId, colorId, data.data);
    if (!updateColor) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao atualizar cor", 400);
    }
    res.json(updateColor);
});
exports.updateColor = updateColor;
const deleteColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, colorId } = req.params;
    const isUsedInProduct = yield Store.getProductByColorId(storeId, colorId);
    if (isUsedInProduct) {
        throw new ApiError_1.ApiErrorValidationFields("Esta cor está sendo usada em um produto", 400);
    }
    const deletedColor = yield Store.deleteColor(storeId, colorId);
    if (!deletedColor) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao deletar cor", 400);
    }
    res.json(deletedColor);
});
exports.deleteColor = deleteColor;
const createSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const createSizeStoreSchema = zod_1.z.object({
        name: zod_1.z
            .string()
            .min(4, "Nome deve ter mais que 4 caracteres")
            .max(10, "Nome deve ter menos que 10 caracteres"),
        value: zod_1.z.string().min(1).max(4),
    });
    const data = createSizeStoreSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const storeByStoreId = yield Store.getStoreByStoreId(storeId);
    if (!storeByStoreId) {
        throw new ApiError_1.ApiErrorValidationFields("Loja inexistente", 400);
    }
    const createSize = yield Store.createSize({
        name: data.data.name,
        value: data.data.value,
        storeId: storeByStoreId.id,
    });
    if (!createSize) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao criar tamanho", 400);
    }
    res.json(createSize);
});
exports.createSize = createSize;
const getAllSizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const sizes = yield Store.getAllSizes(storeId);
    if (!sizes) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao buscar tamanhos", 400);
    }
    res.json(sizes);
});
exports.getAllSizes = getAllSizes;
const getSizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, sizeId } = req.params;
    const size = yield Store.getSizeById(storeId, sizeId);
    res.json(size);
});
exports.getSizeById = getSizeById;
const updateSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, sizeId } = req.params;
    const updateSizeSchema = zod_1.z.object({
        name: zod_1.z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
        value: zod_1.z.string().min(1, "Nome deve ter pelo menos 1 caractere"),
    });
    const data = updateSizeSchema.safeParse(req.body);
    if (!data.success) {
        throw new ApiError_1.ApiErrorValidationFields("Dados inválidos", 200);
    }
    const updatedSized = yield Store.updateSize(storeId, sizeId, data.data);
    if (!updatedSized) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao atualizar tamanho", 400);
    }
    res.json(updatedSized);
});
exports.updateSize = updateSize;
const deleteSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, sizeId } = req.params;
    const isUsedInProduct = yield Store.getProductBySizeId(storeId, sizeId);
    if (isUsedInProduct) {
        throw new ApiError_1.ApiErrorValidationFields("Esta tamanho está sendo usado em um produto", 400);
    }
    const deletedSize = yield Store.deleteSize(storeId, sizeId);
    if (!deletedSize) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao deletar tamanho", 400);
    }
    res.json(deletedSize);
});
exports.deleteSize = deleteSize;
const createBillboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const { label, image: { location, originalname, key, size } } = req.body;
    const billboard = yield Store.createBillboard({
        label,
        storeId,
        image: {
            url: location,
            name: originalname,
            key: key,
            size: size
        }
    });
    if (!billboard) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao criar billboard", 400);
    }
    return res.json(billboard);
});
exports.createBillboard = createBillboard;
const updateBillboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, billboardId } = req.params;
    const { label, image: { location, originalname, key, size } } = req.body;
    const billboard = yield Store.updateBillboard(billboardId, {
        storeId,
        label,
        image: {
            url: location ? location : req.body.image.url,
            name: originalname ? originalname : req.body.image.name,
            key: key ? key : req.body.image.key,
            size: size ? size : req.body.image.size
        }
    });
    if (!billboard) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao atualizar billboard", 400);
    }
    return res.json(billboard);
});
exports.updateBillboard = updateBillboard;
const getBillboardById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, billboardId } = req.params;
    const billboard = yield Store.getBillboardById(storeId, billboardId);
    res.json(billboard);
});
exports.getBillboardById = getBillboardById;
const getAllBillboards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const billboards = yield Store.getAllBillboards(storeId);
    if (!billboards) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao buscar outdoors", 400);
    }
    res.json(billboards);
});
exports.getAllBillboards = getAllBillboards;
const deleteBillboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, billboardId } = req.params;
    const isUsedInCategory = yield Store.getCategoryByBillboardId(storeId, billboardId);
    if (isUsedInCategory) {
        throw new ApiError_1.ApiErrorValidationFields("Esta outdoor está sendo usada em uma categoria", 400);
    }
    const deletedBillboard = yield Store.deleteBillboard(storeId, billboardId);
    if (!deletedBillboard) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao deletar outdoor", 400);
    }
    res.json(deletedBillboard);
});
exports.deleteBillboard = deleteBillboard;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.file);
});
exports.uploadImage = uploadImage;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const { name, billboardId } = req.body;
    const category = yield Store.createCategory({ name, storeId, billboardId });
    if (!category) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao criar categoria", 400);
    }
    return res.json(category);
});
exports.createCategory = createCategory;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const categories = yield Store.getAllCategories(storeId);
    if (!categories) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao buscar categorias", 400);
    }
    return res.json(categories);
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, categoryId } = req.params;
    const category = yield Store.getCategoryById(storeId, categoryId);
    return res.json(category);
});
exports.getCategoryById = getCategoryById;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, categoryId } = req.params;
    const { name, billboardId } = req.body;
    const teste = yield Store.updateCategory(storeId, categoryId, { name, billboardId });
    return res.json(teste);
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, categoryId } = req.params;
    console.log("storeId, categoryId", storeId, categoryId);
    const isUsedInProduct = yield Store.getProductByCategoryId(storeId, categoryId);
    console.log("isUsedInProduct", isUsedInProduct);
    if (isUsedInProduct) {
        throw new ApiError_1.ApiErrorValidationFields("Esta categoria está sendo usada em um produto", 400);
    }
    const deletedCategory = yield Store.deleteCategory(storeId, categoryId);
    if (!deletedCategory) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao deletar categoria", 400);
    }
    res.json(deletedCategory);
});
exports.deleteCategory = deleteCategory;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const products = yield Store.getAllProducts(storeId);
    return res.json(products);
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, productId } = req.params;
    const product = yield Store.getProductById(storeId, productId);
    return res.json(product);
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId } = req.params;
    const { name, categoryId, price, colorId, sizeId, isFeatured, isAvailable, image } = req.body;
    const renomearPropriedades = image.map((image) => ({
        url: image.location,
        name: image.originalname,
        key: image.key,
        size: image.size
    }));
    const product = yield Store.createProduct({
        storeId,
        name,
        categoryId,
        price,
        colorId,
        sizeId,
        isFeatured,
        isAvailable,
        image: renomearPropriedades
    });
    if (!product) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao criar produto", 400);
    }
    return res.json(product);
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, productId } = req.params;
    const { name, categoryId, price, colorId, sizeId, isFeatured, isAvailable, image } = req.body;
    console.log("=====REQ BODY=====");
    console.log(req.body);
    let formattedImages = [];
    if (Array.isArray(image)) {
        formattedImages = image.map(img => ({
            url: img.location ? img.location : img.url,
            name: img.originalname ? img.originalname : img.name,
            key: img.key ? img.key : img.key,
            size: img.size ? img.size : img.size
        }));
    }
    const product = yield Store.updateProduct(productId, {
        name,
        categoryId,
        price,
        colorId,
        sizeId,
        isFeatured,
        isAvailable,
        image: formattedImages
    });
    console.log("======PRODUCT=====");
    console.log(product);
    res.json(product);
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, productId } = req.params;
    const productDeleted = yield Store.deleteProduct(storeId, productId);
    if (!productDeleted) {
        throw new ApiError_1.ApiErrorValidationFields("Erro interno ao deletar produto", 400);
    }
    return res.json(productDeleted);
});
exports.deleteProduct = deleteProduct;
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.files);
    res.json(req.files);
});
exports.uploadImages = uploadImages;
