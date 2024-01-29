import passport from "passport";
import dotenv from 'dotenv'
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { getUserById } from "../services/auth";
import { RequestHandler } from "express";
import { User } from "@prisma/client";

dotenv.config()

const errorMessage = { status: 401, message: "Unauthorized" }

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

passport.use(new JWTStrategy(options, async (payload, done) => {
    //payload é referente ao id do user com esse token
    const user = await getUserById(payload)

    if (user) {
        return done(null, user)

    }

    done(errorMessage, false)

}))





//Middleware
export const privateRoute: RequestHandler = async (req, res, next) => {

    passport.authenticate('jwt', (error: any, user: User) => {
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' }), next(errorMessage)
        }
        req.user = user.id
        next()
    })(req, res, next)
}


export default passport
