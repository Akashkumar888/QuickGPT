import stripeInstance from "../configs/stripe.config.js";
import transactionModel from "../models/credit.model.js";
import userModel from "../models/user.model.js";

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("❌ Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    console.log("✅ Received event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { transactionId, appId } = session.metadata;

      if (appId === "quickgpt") {
        const transaction = await transactionModel.findOne({
          _id: transactionId,
          isPaid: false,
        });

        if (!transaction) {
          console.log("⚠️ Transaction not found or already paid");
          return res.json({ received: true });
        }

        // Update user credits
        await userModel.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } }
        );

        // Mark transaction as paid
        transaction.isPaid = true;
        await transaction.save();

        console.log("🎉 Credits added and transaction marked as paid");
      }
    } else {
      console.log("⚠️ Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.log("❌ Webhook handler error:", error);
    res.status(500).send("Internal Server Error");
  }
};
