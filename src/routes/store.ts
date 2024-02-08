import { Router } from "express";
import { privateRoute } from "../middleware/passport";
import * as Store from "../controllers/store";

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

export default router;
