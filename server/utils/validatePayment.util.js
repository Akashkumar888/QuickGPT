
import crypto from "crypto";

const validatePayment = (orderId, paymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  const sha = crypto.createHmac("sha256", secret);
  sha.update(`${orderId}|${paymentId}`);
  const digest = sha.digest("hex");

  return digest === signature;
};

export default validatePayment;

