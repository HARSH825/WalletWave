import express from 'express';
import { Account } from '../models/accountSchema.js';
import {authMiddleware} from '../middlewares/authentication.js'
const router = express.Router();
import mongoose from 'mongoose';

//get balance
router.get('/balance',authMiddleware,async(req,res)=>{
    const id = req.userId;
    const account = await Account.findOne({
        userId:id,
    }) ;

    res.json({balance:account.balance});
});

//////////Transactions route
router.post('/transaction',authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount , to} = req.body;

    //Fetching accout from
    const account = await Account.findOne({userId:req.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Insufficient balance "
        })
    }
    
    const toAccount = await Account.findOne({userId:to}).session(session);


    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account , or account does not exists"
        });
    }
    //deadlock
    if (req.userId === to) {
        return res.status(400).json({ msg: "Cannot transfer to the same account" });
    }
    //perform transaction

    await Account.updateOne({userId : req.userId}, { $inc : { balance: -amount}}).session(session);
    await Account.updateOne({userId:to} , { $inc :{ balance : amount}} ).session(session);

    //commit transaction together
    await session.commitTransaction();
    res.status(200).json({msg:"Transactions done successfully"});
    await session.endSession();

});

export default router;