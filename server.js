import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect } from "./databse/dbConnect.js";
import userRouter from "./routes/user.route.js";
import aiRouter from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/payment.routes.js"
import webhookRoutes from './routes/webhook.routes.js';
dotenv.config();
await dbConnect();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials:true
  })
);
app.use('/webhook', webhookRoutes);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/ai", aiRouter);
app.use('/api/payment', paymentRoutes);
app.use("/", (req, res) => {
  res.send('<h1>Backend is working fine!!!</h1>')
});

app.listen(process.env.PORT, async () => {
  console.log(`server running at the port :${process.env.PORT}`);
});
