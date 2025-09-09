import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken'
import balckListModel from "../models/blackList.model.js";
import chatModel from "../models/chat.model.js";

// api to register to user
export const registerUser=async(req,res)=>{
  try {
    // validate inputs
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array()});
  }

    const {name,email,password}=req.body;
    // check if user exists
    const isAlreadyUserExist = await userModel.findOne({email});
    if (isAlreadyUserExist) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // just pass raw password, Mongoose will hash automatically:  
    // create user (password gets hashed automatically by pre('save'))
    const user=await userModel.create({
      name,
      email,
      password
    })
      // generate token
    const token=user.generateAuthToken();
    //     Register → issue token so the user is instantly logged in after signup.
    res.status(201).json({
      success:true,
      message:'User created Successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
      token});

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}



// api to login user  
export const loginUser=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({success:false,errors:errors.array()});
    }
    
    const {email,password}=req.body;
    const user=await userModel.findOne({email}).select("+password");
    if(!user)return res.status(401).json({success:false,message:'Invalid Credentials'});
    const isMatch=await user.comparePassword(password);
    if(!isMatch)return res.status(401).json({success:false,message:'Invalid Credentials'});
    
    const token=user.generateAuthToken();
// Login → issue token so an existing user gets a new session.
// This is why both need token generation. It’s not duplication, it’s two different scenarios leading to authentication.

    const safeUser=user.toObject();
    delete safeUser.password;

   res.json({
    success:true,
    message:'Login successfully',
    user:safeUser, // send safe data only
    token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}



// api to get the user data 
export const getUser=async(req,res)=>{
  try {
    res.status(201).json({success:true,user:req.user});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}



// api user logout 
export const logoutUser=async(req,res)=>{
  try {
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({success:false,message:'Not authorized'}); 
    }
    const token=authHeader.split(" ")[1];
    if(!token)return res.status(401).json({success:false,message:"Token Not found"});
    await balckListModel.create({token});
    res.json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

// API to get published images
export const getPublishedImages=async(req,res)=>{
  try {
    const publishedImageMessages=await chatModel.aggregate([
      {$unwind:"$messages"},
      {
        $match:{
          "messages.isImage":true,
          "messages.isPublished":true
        }
      },
      {
        $project:{
          _id:0,
          imageUrl:"$messages.content",
          userName:"$userName",
        }
      }
    ])
    res.status(201).json({success:true,images:publishedImageMessages.reverse()});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}
