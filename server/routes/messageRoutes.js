import express from "express";
import {protectRoute} from "../middleware/auth.js"
import {getUsersForSidebar} from "../controllers/messageControllers.js";
import { getMessages, markMessageAsSeen } from "../controllers/messageControllers.js";
import { sendMessage } from "../controllers/messageControllers.js";



const messageRouter = express.Router();

messageRouter.get("/users",protectRoute, getUsersForSidebar)
messageRouter.get("/:id",protectRoute, getMessages)
messageRouter.put("/mark/:id",protectRoute, markMessageAsSeen)
messageRouter.post("/send/:id",protectRoute,sendMessage)


export default messageRouter;