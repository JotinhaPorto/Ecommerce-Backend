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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = require("../middleware/passport");
const Store = __importStar(require("../controllers/store"));
const multer_1 = __importDefault(require("multer"));
const multerConfig_1 = require("../utils/multerConfig");
const router = (0, express_1.Router)();
router.get("/store", passport_1.privateRoute, Store.getFirstStoreByUserId);
router.get("/store/all", passport_1.privateRoute, Store.getAllStores);
router.get("/store/:id", passport_1.privateRoute, Store.getStoreByStoreId);
router.delete("/store/:id", passport_1.privateRoute, Store.deleteStore);
router.post("/store/create", passport_1.privateRoute, Store.createStore);
router.patch("/store/:id", passport_1.privateRoute, Store.editStore);
router.get("/store/:storeId/color/all", passport_1.privateRoute, Store.getAllColors);
router.get("/store/:storeId/color/:colorId", passport_1.privateRoute, Store.getColorById);
router.post("/store/:storeId/color/create", passport_1.privateRoute, Store.createColor);
router.patch("/store/:storeId/color/:colorId", passport_1.privateRoute, Store.updateColor);
router.delete("/store/:storeId/color/:colorId", passport_1.privateRoute, Store.deleteColor);
router.get("/store/:storeId/size/all", passport_1.privateRoute, Store.getAllSizes);
router.get("/store/:storeId/size/:sizeId", passport_1.privateRoute, Store.getSizeById);
router.post("/store/:storeId/size/create", passport_1.privateRoute, Store.createSize);
router.patch("/store/:storeId/size/:sizeId", passport_1.privateRoute, Store.updateSize);
router.delete("/store/:storeId/size/:sizeId", passport_1.privateRoute, Store.deleteSize);
router.get("/store/:storeId/billboard/all", Store.getAllBillboards);
router.get("/store/:storeId/billboard/:billboardId", Store.getBillboardById);
router.post("/store/:storeId/billboard/create", passport_1.privateRoute, Store.createBillboard);
router.patch("/store/:storeId/billboard/:billboardId", passport_1.privateRoute, Store.updateBillboard);
router.delete("/store/:storeId/billboard/:billboardId", passport_1.privateRoute, Store.deleteBillboard);
router.post("/image/store", passport_1.privateRoute, (0, multer_1.default)(multerConfig_1.multerConfig).single("image"), Store.uploadImage);
router.post("/store/:storeId/category/create", passport_1.privateRoute, Store.createCategory);
router.get("/store/:storeId/category/all", passport_1.privateRoute, Store.getAllCategories);
router.get("/store/:storeId/category/:categoryId", passport_1.privateRoute, Store.getCategoryById);
router.patch("/store/:storeId/category/:categoryId", passport_1.privateRoute, Store.updateCategory);
router.delete("/store/:storeId/category/:categoryId", passport_1.privateRoute, Store.deleteCategory);
router.post("/store/:storeId/product/create", passport_1.privateRoute, Store.createProduct);
router.patch("/store/:storeId/product/:productId", passport_1.privateRoute, Store.updateProduct);
router.get("/store/:storeId/product/all", passport_1.privateRoute, Store.getAllProducts);
router.get("/store/:storeId/product/:productId", passport_1.privateRoute, Store.getProductById);
router.post("/images/store", passport_1.privateRoute, (0, multer_1.default)(multerConfig_1.multerConfig).array("images"), Store.uploadImages);
router.delete("/store/:storeId/product/:productId", passport_1.privateRoute, Store.deleteProduct);
exports.default = router;
