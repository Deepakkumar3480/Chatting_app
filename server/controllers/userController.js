

//signup new user

import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req,res)=>{
    const {fullname,email,password,bio} = req.body;

    try {
        if(!fullname || !email || !password || !bio){
            return res.json({success:false,message:"Missing Details"})
        }
        const user = await User.findOne({email});
        if(user){
            return res.json({sucess:false,message:"Account already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            fullname,email,password:hashpassword,bio
        })

        const token = generateToken(newUser._id)
        // console.log(newUser)
        return res.json({
            success:true,
            userdata:newUser,
            token,
            message:"Account created successfuly"
        })
        
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}

//controller to login user here

export const login = async (req,res)=>{

    try {
        const {email,password} = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password,userData.password);

        if(!isPasswordCorrect){
            return res.json({message:false,message:"Invalid credentials"});
        }

        const token = generateToken(userData._id)
        return res.json({success:true,userData,token,message:"Login successfully"})

    } catch (error) {
        console.log(error.message)
        return res.json({success:false,message:error.message})
    }

}

//controller to check if user is authenticated
export const checkAuth = (req,res)=>{
    return res.json({sucess:true,user:req.user});
}

//controller to update user profile details
export const updateProfile = async (req,res)=>{
try {
    const {profilePic,bio,fullname} = req.body;
    // console.log(profilePic)

    const userId = req.user._id;
    let updatedUser;

    if(!profilePic){
        updatedUser = await User.findByIdAndUpdate(userId,{bio,fullname},{new:true})
    }else{
        const upload = await cloudinary.uploader.upload(profilePic);
        // console.log(upload)

        updatedUser = await User.findByIdAndUpdate(userId,{profilepic:upload.secure_url,bio,fullname},{new:true})
    }
    // console.log(updatedUser)
    updatedUser.password='';
    // console.log(updatedUser)
    return res.json({success:true,user:updatedUser})
} catch (error) {
    console.log(error)
    return res.json({success:false,message:error.message})
}
}