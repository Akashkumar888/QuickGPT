import stripeInstance from "../configs/stripe.config.js";
import transactionModel from "../models/credit.model.js";
import userModel from "../models/user.model.js";


export const stripeWebhooks=async(req,res)=>{
  const sig=req.headers['stripe-signature'];
  let event;
  try {
    event=stripeInstance.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET);

  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook Error:${error.message}`);
  }
  
  try {
    console.log("Received event:", event.type);
    if(event.type==="payment_intent.succeeded"){
    const paymentIntent=event.data.object;
    const sessionList=await stripeInstance.checkout.sessions.list({
      payment_intent:paymentIntent.id,
    })
    const session=sessionList.data[0];
    const {transactionId,appId}=session.metadata;
    if(appId==='quickgpt'){
      const transaction=await transactionModel.findOne({_id:transactionId,isPaid:false});
      // update crdits in user account
      await userModel.updateOne({_id:transaction.userId},
        {$inc:{
          credits:transaction.credits
        }}
      )
      // update credit payment status
      transaction.isPaid=true;
      await transaction.save();
    }
    else return res.json({received:true,message:"Ignored event:Invalid app"});
    }
    else {
      console.log("Unhandled event type:",event.type);
    }
    res.json({received:true});
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal Server Error`);
  }
}

