import mongoose from "mongoose";
// using ttl-> time to live 
const blackListSchema=new mongoose.Schema({
  token:{
    type:String,
    required:true,
    unique:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:30*86400,
  }
})

const blackListModel=mongoose.models.BlackList || mongoose.model('BlackList',blackListSchema);

export default blackListModel;
