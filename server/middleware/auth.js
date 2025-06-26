 

 //Middleware to protect routes

import User from "../models/User.js";
import jwt from 'jsonwebtoken'

 export const protectedRoute = async (req,res,next)=>{
    try {
        
        const token = req.headers.token;

        const decoded =  jwt.verify(token,process.env.JWT_SECURE_KEY)

        const user = await User.findById(decoded.userId).select("-password");
        // console.log(user)

        if(!user) return res.json({sucess:false,message:"User not found"});

        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.json({sucess:false,message:error.message});
    }
 }

