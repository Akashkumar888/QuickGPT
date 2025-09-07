import chatModel from "../models/chat.model.js";

// api controller for creating a new chat 
export const createChat=async(req,res)=>{
  try {
    const userId=req.user._id;
    
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

