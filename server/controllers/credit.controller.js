import stripeInstance from "../configs/stripe.config.js";
import transactionModel from "../models/credit.model.js";
import userModel from "../models/user.model.js";


const plans=[
  {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
];


// API controller for getting all plans
export const getplans=async(req,res)=>{
  try {
    res.status(201).json({success:true,plans});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}



// API controller for purchasing a plans 
export const purchasePlan=async(req,res)=>{
  try {
    const {planId}=req.body;
    const userId=req.user._id;
    const plan=plans.find(plan=>plan._id === planId);
    if(!plan){
      return res.status(401).json({success:false,message:"Invalid Plan"});
    }

    // create new Transaction
    // ✅ create new Transaction with both amount & credits
    const transaction=await transactionModel.create({
      userId:userId,
      planId:plan._id,
      amount: plan.price,    // 💰 actual money
      credits: plan.credits, // 🎯 credits from plan
      isPaid:false,
    });

    const {origin}=req.headers;

    const session=await stripeInstance.checkout.sessions.create({
      line_items:[
        {
          price_data:{
            currency:"usd",
            unit_amount:plan.price*100,
            product_data:{
              name:plan.name
            }
          },
          quantity:1,
        },
      ],
      mode:'payment',
      success_url:`${origin}/loading`,
      cancel_url:`${origin}`,
      metadata:{transactionId:transaction._id.toString(),appId:'quickgpt'},
      expires_at:Math.floor(Date.now()/1000)+30*60, // expires time 30 minutes 
    })
    res.status(201).json({success:true,url:session.url});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


