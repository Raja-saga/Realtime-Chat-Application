import jwt from "jsonwebtoken";
import User from "../models/User.js";



//middlewareto pretect routes
export const protectRoute = async(req,res,next) => {
    try{
        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        req.user = user;
        next();
    }catch(error) {
        console.error(error.message);
        return json({success: false, message: error.message});
    }
}
//conroller to check if user is authenticated
export const chechAuth = (req, res) => {
    res.json({success: true, user: req.user});
}