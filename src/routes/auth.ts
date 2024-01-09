import { Router } from "express";
import * as Auth from '../controllers/auth'

const router = Router()

router.post('/register', Auth.Register)
router.post('/login', Auth.Login)
router.get('/profile', Auth.Profile)


export default router
