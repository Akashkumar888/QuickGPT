import express from 'express';
import { getPlans, purchasePlan, createOrder, verifyOrder } from '../controllers/credit.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const creditRouter = express.Router();

creditRouter.get("/plan", getPlans);
creditRouter.post("/purchase", authUser, purchasePlan);
creditRouter.post("/create-order", authUser, createOrder);
creditRouter.post("/verify-order", authUser, verifyOrder);

export default creditRouter;
