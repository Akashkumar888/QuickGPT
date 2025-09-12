import razorpayInstance from "../configs/razorpay.configs.js";
import transactionModel from "../models/credit.model.js";
import userModel from "../models/user.model.js";
import validatePayment from "../utils/validatePayment.util.js";

// Plans in dollars
const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,  // $10
    credits: 100,
    features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,  // $20
    credits: 500,
    features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,  // $30
    credits: 1000,
    features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
  }
];


// Exchange rate: 1 USD → 83 INR (example)
const USD_TO_INR = 83;

export const getPlans = async (req, res) => {
  try {
    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find(p => p._id === planId);
    if (!plan) return res.status(400).json({ success: false, message: "Invalid plan" });

    const transaction = await transactionModel.create({
      userId,
      planId: plan._id,
      amount: plan.price,  // store in USD
      credits: plan.credits,
      isPaid: false
    });

    // Convert USD → INR for Razorpay
    const amountInINR = plan.price * USD_TO_INR * 100; // in paise

    res.status(200).json({
      success: true,
      transactionId: transaction._id,
      amount: amountInINR,
      currency: "INR",
      displayAmount: plan.price // for frontend display in $
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency, transactionId } = req.body;

    const order = await razorpayInstance.orders.create({
      amount,
      currency,
      receipt: transactionId,
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

    const isValid = validatePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) return res.status(400).json({ success: false, message: "Transaction not legit" });

    // mark transaction as paid
    const transaction = await transactionModel.findByIdAndUpdate(
      transactionId,
      { isPaid: true },
      { new: true }
    );

    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });

    // update user's credits
    const user = await userModel.findById(transaction.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.credits += transaction.credits; // add purchased credits
    await user.save();

    res.json({ success: true, message: "Transaction verified and credits updated", orderId: razorpay_order_id, paymentId: razorpay_payment_id, credits: user.credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
