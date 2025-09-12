import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import connectDB from './configs/db.config.js';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';
import creditRouter from './routes/credit.route.js';
const app = express();



//Database connection
connectDB();




// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// test route
app.get("/", (req, res) => {
  res.send('Server is Live!');
});

// all /api/routes will go here later
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
app.use('/api/credit',creditRouter);

export default app;
