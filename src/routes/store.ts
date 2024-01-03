import { Router } from "express";
import { privateRoute } from "../middleware/passport";

const router = Router()


router.get("/lista", privateRoute, (req, res) => { res.json({ message: "Você está com acesso a esta rota" }) })
export default router