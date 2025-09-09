
import imageKit from "../configs/imageKit.config.js";
import openai from "../configs/openai.config.js";
import chatModel from "../models/chat.model.js";
import userModel from "../models/user.model.js";
import axios from 'axios'


// text-based ai chat messages controller
export const textMessageController=async(req,res)=>{
  try {
    const userId=req.user._id;
    // check credits
    if(req.user.credits<1){
      return res.status(401).json({success:false,message:"You don't have enough credits to use this feature."})
    }
    const {chatId,prompt}=req.body;

    const chat=await chatModel.findOne({userId,_id:chatId});

    chat.messages.push({role:"user",content:prompt,timestamp:Date.now(),isImage:false});
   
    const {choices}=await openai.chat.completions.create({
      model:"gemini-2.5-flash",
      reasoning_effort:'low',
      messages:[
        {
          role:'user',
          content:prompt
        },
      ],
    })
  
  console.log(choices[0].message);
  const reply={...choices[0].message,timestamp:Date.now(),isImage:false};
  res.status(201).json({success:true,reply});
  chat.messages.push(reply);
  await chat.save();
  
  await userModel.updateOne({_id:userId},{
    $inc:{
      credits:-1
    }
  });


  } catch (error) {
    console.log(error);
    res.status(500).json({succees:false,message:error.message});
  }
}



// image generation message controller using ai 
// export const imageMessageController=async(req,res)=>{
//   try {
//     const userId=req.user._id;
//     // check credits
//     if(req.user.credits<2){
//       return res.status(401).json({success:false,message:"You don't have enough credits to use this feature."})
//     }
//     const {prompt,chatId,isPublished}=req.body;
//     // find chat
//     const chat=await chatModel.findOne({userId,_id:chatId});
//     // push user message
//     chat.messages.push({
//       role:"user",
//       content:prompt,
//       timestamp:Date.now(),
//       isImage:false
//     });
    
//     // encode the prompt
//     const encodeedPrompt=encodeURIComponent(prompt);

//     // construct ImageKit AI generation URL
//     const generatedImageUrl=`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt+${encodeedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;
   
//     // Trigger generation by fetching from Imagekit 
//     const aiImageResponse=await axios.get(generatedImageUrl,{
//       responseType:'arraybuffer'
//     });

//     //convert to Base64
//     const base64Image=`data:image/png;base64,${Buffer.from(aiImageResponse.data,"binary").toString('base64')}`;

//     // upload to imagekit media library
//     const uploadResponse=await imageKit.upload({
//       file:base64Image,
//       fileName:`${Date.now()}.png`,
//       folder:"quickgpt"
//     })
//     const reply={
//       role:"assistant",
//       content:uploadResponse.url,
//       timestamp:Date.now(),
//       isImage:true,
//       isPublished
//     };
//     res.status(201).json({success:true,reply});
   
//     chat.messages.push(reply);
//     await chat.save();

//     await userModel.updateOne({_id:userId},
//       {
//         $inc:{
//        credits:-2
//       }
//     })
    
//   } catch (error) {
//     console.log(error);
//     res.status(201).json({success:false,message:error.message});
//   }
// }



export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.status(401).json({ success: false, message: "You don't have enough credits." });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await chatModel.findOne({ userId, _id: chatId });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    });

    // === ImageKit AI generation: generate directly from prompt ===
    const uploadResponse = await imageKit.upload({
      file: `prompt:${prompt}`,   // AI generation syntax
      fileName: `${Date.now()}.png`,
      folder: "quickgpt"
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished
    };

    // reply, save and deduct credits
    res.status(201).json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();

    await userModel.updateOne({ _id: userId }, { $inc: { credits: -2 } });

  } catch (error) {
    // better error logging so you can see ImageKit response body
    console.error("Image upload error:", error?.response?.status, error?.response?.data || error.message);
    res.status(500).json({ success: false, message: error?.response?.data || error.message });
  }
};
