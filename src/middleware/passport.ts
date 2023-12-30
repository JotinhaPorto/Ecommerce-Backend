import passport from "passport";
import dotenv from 'dotenv'
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { getUserById } from "../services/auth";
import { RequestHandler } from "express";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

dotenv.config()

const errorMessage = { status: 401, message: "Unauthorized" }

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

passport.use(new JWTStrategy(options, async (payload, done) => {

    const user = await getUserById(payload.id)

    if (!user) {
        return done(errorMessage, false)
    }

    return done(null, user)

}))





//Middleware

export const privateRoute: RequestHandler = async (req, res, next) => {

    passport.authenticate('jwt', (user: User) => {
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' }), next(errorMessage)
        }
        req.user = user
        next()
    })(req, res, next)
}


export default passport
