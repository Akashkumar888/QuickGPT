import chatModel from "../models/chat.model.js";

// api controller for creating a new chat 
export const createChat=async(req,res)=>{
  try {
    const userId=req.user._id;
    const chatData={
      userId,
      messages:[],
      name:"New Chat",
      userName:req.user.name
    };
    await chatModel.create(chatData);
    res.status(201).json({success:true,message:"Char created."});

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

// api controller for getting all chats
export const getChats=async(req,res)=>{
  try {
    const userId=req.user._id;
    const chats=await chatModel.find({userId}).sort({updatedAt:-1});
    res.status(201).json({success:true,chats});

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

// api controller for deleting a chat 

export const deleteChat=async(req,res)=>{
  try {
    const userId=req.user._id;
    const {chatId}=req.body;
    await chatModel.deleteOne({_id:chatId,userId});
    res.status(201).json({success:true,message:"Chat deleted."});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}