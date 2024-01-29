import { Router } from "express";
import { privateRoute } from "../middleware/passport";
import * as Store from "../controllers/store"

const router = Router()


router.get("/store", privateRoute, Store.getStoreByUserId)
router.get("/store/all", privateRoute, Store.getAllStores)
router.get("/store/:id", privateRoute, Store.getStoreByStoreId)
router.delete("/store/:id", privateRoute, Store.deleteStore)
router.post("/store/create", privateRoute, Store.createStore)
router.patch("/store/:id", privateRoute, Store.editStore)
export default router
