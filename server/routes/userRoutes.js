import express from 'express';
import { checkAuth, getProfile, login, signup, updateProfile } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login)
userRouter.put("/update-profile",protectRoute, updateProfile);
userRouter.get("/auth-check", protectRoute, checkAuth);
userRouter.get("/get-profile",protectRoute, getProfile);

export default userRouter;