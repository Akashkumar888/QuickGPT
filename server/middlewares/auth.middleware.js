import balckListModel from "../models/blackList.model.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const authUser=async(req,res,next)=>{
  try {
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({success:false,message:"Not authorized"});
    }
    const token=authHeader.split(" ")[1];
    const isBlackListToken=await balckListModel.findOne({token});
    if(isBlackListToken){
      return res.status(400).json({success:false,message:"token is expired"});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    const userId=decoded._id;
    
    const user=await userModel.findById(userId);
    if(!user)return res.status(401).json({ success: false, message: "User not found." });

    req.user=user;// attach user
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

