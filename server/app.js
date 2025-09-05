import 'dotenv/config'
import express from 'express';
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.send('Hello');
});

// all /api/routes will go here later

export default app;
