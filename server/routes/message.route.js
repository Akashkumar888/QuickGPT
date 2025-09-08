
import express from 'express'
import { imageMessageController, textMessageController } from '../controllers/message.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
const messageRouter=express.Router();

messageRouter.post("/text",authUser, textMessageController);
messageRouter.post("/image",authUser, imageMessageController);


export default messageRouter;