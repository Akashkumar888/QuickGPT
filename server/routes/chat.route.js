
import express from 'express'
import { createChat, deleteChat, getChats } from '../controllers/chat.controller.js';
import {authUser} from "../middlewares/auth.middleware.js"
const chatRouter=express.Router();



chatRouter.get('/create',authUser, createChat);
chatRouter.get('/get',authUser, getChats);
chatRouter.post('/delete',authUser, deleteChat);

export default chatRouter;