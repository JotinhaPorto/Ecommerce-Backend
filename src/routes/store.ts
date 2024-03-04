import { Router } from "express";
import { privateRoute } from "../middleware/passport";
import * as Store from "../controllers/store";
import multer from "multer";
import { multerConfig } from "../utils/multerConfig";

const router = Router();

router.get("/store", privateRoute, Store.getFirstStoreByUserId);
router.get("/store/all", privateRoute, Store.getAllStores);
router.get("/store/:id", privateRoute, Store.getStoreByStoreId);
router.delete("/store/:id", privateRoute, Store.deleteStore);
router.post("/store/create", privateRoute, Store.createStore);
router.patch("/store/:id", privateRoute, Store.editStore);

router.get("/store/:storeId/color/all", privateRoute, Store.getAllColors);
router.get("/store/:storeId/color/:colorId", privateRoute, Store.getColorById);
router.post("/store/:storeId/color/create", privateRoute, Store.createColor);
router.patch("/store/:storeId/color/:colorId", privateRoute, Store.updateColor);
router.delete(
  "/store/:storeId/color/:colorId",
  privateRoute,
  Store.deleteColor
);

router.get("/store/:storeId/size/all", privateRoute, Store.getAllSizes);
router.get("/store/:storeId/size/:sizeId", privateRoute, Store.getSizeById);
router.post("/store/:storeId/size/create", privateRoute, Store.createSize);
router.patch("/store/:storeId/size/:sizeId", privateRoute, Store.updateSize);
router.delete("/store/:storeId/size/:sizeId", privateRoute, Store.deleteSize);

router.get("/store/:storeId/billboard/all", Store.getAllBillboards);
router.get("/store/:storeId/billboard/:billboardId", Store.getBillboardById);
router.post("/store/:storeId/billboard/create", privateRoute, Store.createBillboard);
router.patch("/store/:storeId/billboard/:billboardId", privateRoute, Store.updateBillboard);
router.delete("/store/:storeId/billboard/:billboardId", privateRoute, Store.deleteBillboard);
router.post("/image/store", privateRoute, multer(multerConfig).single("image"), Store.uploadImage);

router.post("/store/:storeId/category/create", privateRoute, Store.createCategory);
router.get("/store/:storeId/category/all", privateRoute, Store.getAllCategories);
router.get("/store/:storeId/category/:categoryId", privateRoute, Store.getCategoryById);
router.patch("/store/:storeId/category/:categoryId", privateRoute, Store.updateCategory);
router.delete("/store/:storeId/category/:categoryId", privateRoute, Store.deleteCategory);

router.post("/store/:storeId/product/create", privateRoute, Store.createProduct);
router.patch("/store/:storeId/product/:productId", privateRoute, Store.updateProduct);
router.get("/store/:storeId/product/all", privateRoute, Store.getAllProducts);
router.get("/store/:storeId/product/:productId", privateRoute, Store.getProductById);
router.post("/images/store", privateRoute, multer(multerConfig).array("images"), Store.uploadImages);
router.delete("/store/:storeId/product/:productId", privateRoute, Store.deleteProduct);

export default router;  
