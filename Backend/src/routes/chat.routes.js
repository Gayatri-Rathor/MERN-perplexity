import { Router } from "express"
import { sendMessage, getChats, getMessages, deleteChats, downloadChatPDF } from "../controllers/chat.controller.js";
import { authUserMiddleware } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";

const chatRouter = Router()

// chatRouter.post('/message', authUserMiddleware, sendMessage)


chatRouter.post("/message",authUserMiddleware,uploadMiddleware.single("image"),sendMessage);


chatRouter.get('/', authUserMiddleware, getChats)

chatRouter.get('/:chatId/messages', authUserMiddleware, getMessages)

chatRouter.delete('/delete/:chatId', authUserMiddleware, deleteChats)

chatRouter.get("/download/:chatId", authUserMiddleware, downloadChatPDF);





export default chatRouter;