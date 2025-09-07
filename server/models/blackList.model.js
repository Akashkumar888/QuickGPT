import mongoose from "mongoose";
// using ttl-> time to live 
const balckListSchema=new mongoose.Schema({
  token:{
    type:String,
    required:true,
    unique:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:7*86400,
  }
})

const balckListModel=mongoose.models.BlackList || mongoose.model('BlackList',balckListSchema);

export default balckListModel;