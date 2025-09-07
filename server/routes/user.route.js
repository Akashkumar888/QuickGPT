import express from 'express'
import {  getUser, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
const userRouter=express.Router();
import {body} from 'express-validator';
import { authUser } from '../middlewares/auth.middleware.js';


userRouter.post('/register',[
  body('email').isEmail().withMessage("Invalid email"),
  body('password').isLength({min:6}).withMessage("Please enter a strong password")
],
registerUser);

userRouter.post("/login",[
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({min:6}).withMessage("Please enter a strong password")
],loginUser);

userRouter.get("/data",authUser,getUser);
userRouter.post("/logout",authUser,logoutUser);


export default userRouter;