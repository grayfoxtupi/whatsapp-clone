import express from 'express'
import { signUp, logIn, logOut, update, checkUser } from '../controllers/auth.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const authRouter = express.Router()

authRouter.post("/signup", signUp)

authRouter.post("/login", logIn)

authRouter.post("/logout", protectedRoute, logOut)

authRouter.put("/update-profile", protectedRoute, update)

authRouter.get("/check", protectedRoute, checkUser)


export default authRouter