
import express from 'express'
import { createChat } from '../controllers/chat.controller.js';
const chatRouter=express.Router();



chatRouter.post('/create',createChat);

export default chatRouter;