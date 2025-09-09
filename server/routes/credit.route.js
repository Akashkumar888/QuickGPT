
import express from 'express';
import {  getplans, purchasePlan } from '../controllers/credit.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
const creditRouter=express.Router();

creditRouter.get("/plan",getplans);
creditRouter.post("/purchase",authUser, purchasePlan);


export default creditRouter;
