import { Router } from "express";
import * as Auth from '../controllers/auth'
import { privateRoute } from "../middleware/passport";

const router = Router()

router.post('/register', Auth.Register)
router.post('/login', Auth.Login)



export default router
