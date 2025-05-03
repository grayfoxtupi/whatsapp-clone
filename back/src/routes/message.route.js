import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { getUsersForSideBar, getChatMessages, sendMessage} from '../controllers/message.controller.js'

const router = express.Router()

router.get("/getUsersForSideBar", protectedRoute, getUsersForSideBar)

router.get("/:receiverId", protectedRoute, getChatMessages)

router.post("/send", protectedRoute, sendMessage)

export default router