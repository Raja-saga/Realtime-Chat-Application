import jwt from "jsonwebtoken";
import User from "../models/User.js";

//middlewareto pretect routes
export const protectRoute = async(req,res,next) => {
    try{
       // const token = req.headers.token;
       const authHeader = req.headers.authorization;

       if (!authHeader || !authHeader.startsWith("Bearer ")) {
       return res.status(401).json({ success: false, message: "No token provided" });
       }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        req.user = user;
        next();
    }catch(error) {
        console.error(error.message);
        return res.status(401).json({success: false, message: error.message});
    }
}
//conroller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
}