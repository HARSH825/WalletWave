import express from 'express';
import dotenv from 'dotenv';
import {connectDb} from './config/connectDb.js';
import  userRouter  from './routes/userRouter.js';
import  accountRouter from './routes/accountRouter.js';
import cors from 'cors';

app.use(cors());
dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/v1/',userRouter);
app.use('/api/v1/account',accountRouter);

connectDb();
const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log("Server Running on Port : "+PORT);
});

