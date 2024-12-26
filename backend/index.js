import express from 'express';
import dotenv from 'dotenv';
import {connectDb} from './config/connectDb.js';

dotenv.config();

const app = express();

app.use(express.json());

connectDb();
const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log("Server Running on Port : "+PORT);
});

