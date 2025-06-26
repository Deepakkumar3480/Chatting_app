

//get all users except the logged in user

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js"
import {io,userSocketMap} from '../server.js'


//for user with unread messages for all sidebar user expcept logged in user
export const getUsersForSidebar = async (req,res)=>{
    try {
        const userId = req.user._id
        //here the user except the login user
        const filteredUsers = await User.find({_id:{$ne:userId}}).select('-password')

        const unseenMessages = {};
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId:user._id,receiverId:user._id,seen:false})
            if(messages.length>0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessages})
    } catch (error) {
        console.log(error)
        return res.json({sucess:false,message:error.message})
    }
}

//get all messages for selected user 
//or here to get messages send by me or the messages send to me
export const getMessages = async (req,res)=>{
    try {
       
        const{id:selectedUserId} = req.params;
        // console.log(selectedUserId)
        const myId = req.user._id;
        // const myId = req.body.user;
        // console.log(selectedUserId,myId)

        const messages = await Message.find({
            $or:[
                {senderId:myId,
                    receiver_Id:selectedUserId
                },
                {senderId:selectedUserId,
                    receiver_Id:myId
                },
            ]
        })
        if(!messages){
            return res.json({message:'kuch nhi h yar'})
        }
        await Message.updateMany({senderId:selectedUserId,receiver_Id:myId},{seen:true})
        // console.log(messages)
        return res.json({success:true,messages})
        // return res.json({name:"hello"})
        
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

//api to mark message as seen using message id

export const markMessageAsSeen = async (req,res)=>{
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        return res.json({success:true})
    } catch (error) {
        console.log(error.message)
        return res.json({
            success:false,
            error:error.message
        })
    }
}

//send message to selected user
export const sendMessage = async (req,res)=>{
    try {
        const {text,image} = req.body;
        const receiver_Id = req.params.id
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiver_Id,
            text,
            image:imageUrl
        })

        //Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiver_Id];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        return res.json({success:true,newMessage});
    } catch (error) {
         console.log(error.message)
        return res.json({
            success:false,
            error:error.message
        })
    }
}